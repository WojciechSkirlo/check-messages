<template>
  <main class="w-full bg-white md:max-w-[390px] md:border overflow-hidden md:border-black relative">
    <Transition
      enter-from-class="-translate-x-full"
      leave-to-class="-translate-x-full"
      enter-active-class="duration-300 transition-translate"
      leave-active-class="duration-300 transition-translate"
    >
      <div v-if="isInfo" class="absolute top-0 left-0 z-10 flex flex-col w-full h-full px-6 py-8 bg-white">
        <div class="flex items-center justify-between w-full mb-8 gap-x-6">
          <div class="h-9 w-9"></div>
          <h2 class="text-lg font-semibold first-letter:uppercase">Outboarding</h2>
          <button class="flex items-center justify-center border border-gray-100 h-9 w-9 rounded-xl" @click="isInfo = false">
            <BaseIcon name="XMarkIcon" class="transition-colors duration-300" />
          </button>
        </div>
        <div class="flex flex-col justify-between flex-1 gap-6 px-4 py-14 text-md">
          <div class="grid grid-cols-1 gap-6">
            <p>
              If you want to know your messenger statistics you are in the right place. Yeah, you can check how many messages you exchanged with your
              friends.
            </p>
            <p>Before you see your stats, you have to do a few things.</p>
          </div>
          <BaseButton @click="isInfo = false">Understand</BaseButton>
        </div>
      </div>
    </Transition>
    <Swiper class="w-full h-full mySwiper" @swiper="setSwiper" @slide-change-transition-end="resetLoader">
      <SwiperSlide class="w-full h-screen md:h-[820px]">
        <div class="flex flex-col w-full h-full py-8">
          <div class="flex flex-col px-6">
            <div class="flex items-center justify-between w-full mb-8 gap-x-6">
              <div class="h-9 w-9"></div>
              <h2 class="text-lg font-semibold first-letter:uppercase">messages</h2>
              <button class="flex items-center justify-center border border-gray-100 h-9 w-9 rounded-xl" @click="isInfo = true">
                <BaseIcon name="QuestionMarkCircleIcon" class="transition-colors duration-300" />
              </button>
            </div>
          </div>
          <Transition name="fade">
            <div class="relative w-full h-full p-8 text-center">
              <BaseInputFile v-if="!isLoader" :model-value="vFiles" :validation="validationFiles" @update:model-value="getFiles" />
            </div>
          </Transition>
          <Transition name="fade">
            <BaseLoader v-if="isLoader" :is-loaded="isLoaded" @check-results="mySwiper?.slideNext()" />
          </Transition>
        </div>
      </SwiperSlide>
      <SwiperSlide class="w-full h-screen md:h-[820px]">
        <TheUsers :users="users" @slide-prev="mySwiper?.slidePrev()" @show-user="showUser" />
      </SwiperSlide>
      <SwiperSlide v-if="selectedUser !== null" class="w-full h-screen md:h-[820px]">
        <TheUser :user="selectedUser" @slide-prev="mySwiper?.slidePrev()" />
      </SwiperSlide>
    </Swiper>
  </main>
</template>

<script setup lang="ts">
import type { Ref } from "vue";
import type { User, Validation, JSON, Message } from "../types/index";
import type { Swiper as SwiperType } from "swiper/types";
import * as zip from "@zip.js/zip.js";
import { ref } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import TheUsers from "../src/components/the/Users.vue";
import TheUser from "./components/the/User.vue";

const isLoader = ref(false);
const isLoaded = ref(false);
const isInfo = ref(false);
const vFiles = ref<FileList | null>(null);

const selectedUser = ref<User | null>(null);
const users: Ref<Array<User>> = ref([]);

const validationFiles = ref<Validation>({
  is: null,
  message: "",
});

const mySwiper: Ref<SwiperType | null> = ref(null);

const setSwiper = (swiper: any) => {
  mySwiper.value = swiper;
};

const loadingUser = (state: "start" | "loaded" | "error") => {
  if (state === "start") {
    [isLoader.value, mySwiper.value!.allowSlideNext, mySwiper.value!.allowSlidePrev] = [true, false, false];
  } else if (state === "loaded") {
    [isLoaded.value, mySwiper.value!.allowSlideNext, mySwiper.value!.allowSlidePrev] = [true, true, true];
  } else {
    [isLoader.value, mySwiper.value!.allowSlideNext, mySwiper.value!.allowSlidePrev] = [false, true, true];

    validationFiles.value = {
      is: false,
      message: "Sorry, but I didn't find anything :/",
    };
  }
};

const getFiles = async (files: FileList) => {
  vFiles.value = files;

  if (files.length < 1) return;
  if ([...files].some((item: File) => item.type !== "application/x-zip-compressed" && item.type !== "application/zip")) {
    validationFiles.value = {
      is: false,
      message: "Wrong extension of file. Supported extension: .zip",
    };
    return;
  } else {
    validationFiles.value = {
      is: true,
      message: "",
    };
  }

  
  if (users.value.length) users.value = [];
  
  loadingUser("start");

  try {
    for (const file of files) {
      const entries = await getFileEntries(file);

      for (const entry of entries) {
        const json: JSON = JSON.parse(await entry.getData?.(new zip.TextWriter())!);
        const userFolderName = entry.filename.split("/").at(-2);
        const index = users.value.findIndex((item: User) => item.id === userFolderName);
        const firstAndLastMessage = findFirstAndLastMessage(json.messages);
        const numberOfYourMessagesInFile = getNumberOfYourMessagesInFile("Wojciech Skir\u00c5\u0082o", json.messages);

        if (userFolderName === undefined) continue;

        if (index > -1) {
          users.value[index].info.totalMessages += json.messages.length;
          if (firstAndLastMessage.firstMessage.timestamp_ms < users.value[index].info.firstMessage.timestamp_ms) {
            users.value[index].info.firstMessage = firstAndLastMessage.firstMessage;
          }
          if (firstAndLastMessage.lastMessage.timestamp_ms > users.value[index].info.lastMessage.timestamp_ms) {
            users.value[index].info.lastMessage = firstAndLastMessage.lastMessage;
          }
          users.value[index].info.yourMessages += numberOfYourMessagesInFile;
        } else {
          const user: User = {
            id: userFolderName,
            name: json.title,
            ranking: null,
            info: {
              totalMessages: json.messages.length,
              isGroup: json.participants.length > 2,
              yourMessages: numberOfYourMessagesInFile,
              firstMessage: firstAndLastMessage.firstMessage,
              lastMessage: firstAndLastMessage.lastMessage,
            },
          };

          users.value.push(user);
        }
      }

      sortAndMapUsers();
    }
  } catch (error) {
    console.log("error", error);
  } finally {
    users.value.length > 0 ? loadingUser("loaded") : loadingUser("error");
  }
};

const getFileEntries = async (file: File) => {
  const zipReader = new zip.ZipReader(new zip.BlobReader(file));
  let entries = (await zipReader.getEntries()) || [];

  // entry filter
  entries = entries.filter((item: zip.Entry) => {
    const extension = item.filename.split(".").pop();
    return extension === "json";
  });

  // inbox and archived_threads
  entries = entries.filter((item: zip.Entry) => {
    const folderName = item.filename.split("/");

    return folderName.includes("inbox") || folderName.includes("archived_threads");
  });

  await zipReader.close();

  return entries;

};

/**
 * This function sort and map User object
 */
const sortAndMapUsers = () => {
  users.value.sort((a: User, b: User) => b.info.totalMessages - a.info.totalMessages);

  users.value = users.value.splice(0, 100);
  users.value = users.value.map((item: User, index: number) => ({
    ...item,
    ranking: index + 1,
  }));
};

/**
 * Find the first message and last message in Array<message>
 * @param {Array<number>} messages Array of messages
 */
const findFirstAndLastMessage = (messages: Array<Message>) => {
  return messages.reduce(
    (acc: { firstMessage: Message; lastMessage: Message }, message: Message) => {
      if (message.timestamp_ms > acc.lastMessage.timestamp_ms) return { ...acc, lastMessage: message };
      else if (message.timestamp_ms < acc.firstMessage.timestamp_ms) return { ...acc, firstMessage: message };
      else return { ...acc };
    },
    { firstMessage: messages[0], lastMessage: messages[0] }
  );
};

/**
 * This function return number of messages given user
 * @param {Array<Message>} messages Array of message ovject
 */
const getNumberOfYourMessagesInFile = (userName: string, messages: Array<Message>) => {
  return messages.reduce((acc, message) => (message.sender_name === userName ? acc + 1 : acc), 0);
};

const resetLoader = (swiper: SwiperType) => {
  if (swiper.activeIndex === 1) {
    isLoader.value = false;
    isLoaded.value = false;
    vFiles.value = null;
  }

  if (swiper.previousIndex === 2 && selectedUser.value !== null) selectedUser.value = null;
};

const showUser = (user: User) => {
  selectedUser.value = user;
  setTimeout(() => {
    mySwiper.value?.slideTo(2);
  }, 200);
};
</script>
