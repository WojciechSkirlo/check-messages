<template>
  <main class="w-full bg-white md:max-w-[390px] md:border md:border-black">
    <Swiper class="w-full h-full mySwiper" @swiper="setSwiper" @slide-change-transition-end="resetLoader">
      <SwiperSlide class="w-full h-screen md:h-[820px]">
        <div class="flex flex-col w-full h-full py-8">
          <div class="flex flex-col px-6">
            <div class="flex items-center justify-center w-full mb-8 gap-x-6">
              <h2 class="text-lg font-semibold first-letter:uppercase">messages</h2>
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
const vFiles = ref<FileList | null>();

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

  loadingUser("start");
  if (users.value.length > 0) users.value = [];
  for (const file of files) {
    await getDataFile(file);
  }
  sortAndMapUsers();
  users.value.length > 0 ? loadingUser("loaded") : loadingUser("error");

  console.log("users", users.value);
};

const getDataFile = async (file: File) => {
  return new Promise((resolve, _) => {
    const reader = new FileReader();

    reader.onload = async (event) => {
      const blob = new Blob([event.target?.result!]);
      const zipReader = new zip.ZipReader(new zip.BlobReader(blob));
      let entries = (await zipReader.getEntries()) || [];

      // entry filter
      entries = entries.filter((item: any) => {
        const extension = item.filename.split(".").pop();
        return extension === "json";
      });

      // inbox
      entries = entries.filter((item: any) => {
        let folderName = item.filename.split("/");

        if (folderName.length >= 2) {
          folderName = folderName[1];
          return folderName === "inbox" || folderName === "archived_threads";
        }
      });

      for (const entry of entries) {
        const json: JSON = JSON.parse(await entry.getData?.(new zip.TextWriter())!);
        const userFolderName = entry.filename.split("/")[2];

        const index = users.value.findIndex((item: User) => item.id === userFolderName);
        const firstAndLastMessage = findFirstAndLastMessage(json.messages);
        const numberOfYourMessagesInFile = getNumberOfYourMessagesInFile("Wojciech Skir\u00c5\u0082o", json.messages);

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
              isGroup: json.thread_type === "RegularGroup",
              yourMessages: numberOfYourMessagesInFile,
              firstMessage: firstAndLastMessage.firstMessage,
              lastMessage: firstAndLastMessage.lastMessage,
            },
          };

          users.value.push(user);
        }
      }

      await zipReader.close();
      resolve(reader.result);
    };

    reader.onerror = () => {
      resolve(reader.result);
    };

    reader.readAsArrayBuffer(file);
  });
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
