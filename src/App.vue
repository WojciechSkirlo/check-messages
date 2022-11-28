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
              <BaseInputFile v-if="!isLoader" :model-value="vFiles!" :validation="validationFiles" @update:model-value="getFiles" />
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
import * as zip from "@zip.js/zip.js";
import { ref } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import type { Ref } from "vue";
import type { User, Validation } from "../types/index";
import type { Swiper as SwiperType } from "swiper/types";
import TheUsers from "../src/components/the/Users.vue";
import TheUser from "./components/the/User.vue";

interface Message {
  timestamp_ms: number;
  sender_name: string;
}

interface JSON {
  title: string;
  thread_type: "Regular" | "RegularGroup";
  messages: Array<Message>;
}

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

        const timestamps = findTimestamps(json.messages.map((item: Message) => item.timestamp_ms));
        const numberOfYourMessagesInFile = getNumberOfYourMessagesInFile("Wojciech Skir\u00c5\u0082o", json.messages);
        console.log("number of", numberOfYourMessagesInFile);

        if (index > -1) {
          users.value[index].info.totalMessages += json.messages.length;
          if (timestamps.smallest < users.value[index].info.dates.timestampFirstMessage)
            users.value[index].info.dates.timestampFirstMessage = timestamps.smallest;
          if (timestamps.biggest > users.value[index].info.dates.timestampLastMessage)
            users.value[index].info.dates.timestampLastMessage = timestamps.biggest;

          users.value[index].info.yourMessages += numberOfYourMessagesInFile;
        } else {
          console.log("timeStamps", timestamps);

          const user: User = {
            id: userFolderName,
            name: decodeText(json.title),
            ranking: 0,
            info: {
              totalMessages: json.messages.length,
              isGroup: json.thread_type === "RegularGroup",
              yourMessages: numberOfYourMessagesInFile,
              whoStartConversation: "Test",
              dates: {
                timestampFirstMessage: timestamps.smallest,
                timestampLastMessage: timestamps.biggest,
              },
            },
          };

          users.value.push(user);

          // console.log(
          //   "json",
          //   json.messages[json.messages.length - 1].timestamp_ms
          // );
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

const sortAndMapUsers = () => {
  users.value.sort((a: User, b: User) => b.info.totalMessages - a.info.totalMessages);

  users.value = users.value.splice(0, 100);
  users.value = users.value.map((item: User, index: number) => ({
    ...item,
    ranking: index + 1,
  }));
};

/**
 * Find the smallest timestamp and the biggest timestamp in Array of timestamp
 * @param {Array<number>} timestamps Array of timestamps
 */
const findTimestamps = (timestamps: Array<number>) => {
  return timestamps.reduce(
    (acc: { smallest: number; biggest: number }, timestamp: number) => {
      if (timestamp > acc.biggest) return { ...acc, biggest: timestamp };
      else if (timestamp < acc.smallest) return { ...acc, smallest: timestamp };
      else return { ...acc };
    },
    { smallest: timestamps[0], biggest: timestamps[0] }
  );
};

/**
 * This function return number of messages given user
 * @param {Array<Message>} messages Array of message ovject
 */
const getNumberOfYourMessagesInFile = (userName: string, messages: Array<Message>) => {
  return messages.reduce((acc, message) => (message.sender_name === userName ? acc + 1 : acc), 0);
};

const decodeText = (text: string) => new TextDecoder().decode(new Uint8Array(text.split("").map((r: any) => r.charCodeAt())));

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
