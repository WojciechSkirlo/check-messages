<template>
  <main class="w-full bg-white md:max-w-[390px] md:border md:border-black">
    <Swiper
      class="w-full h-full mySwiper"
      @swiper="setSwiper"
      @slide-change-transition-end="resetLoader"
    >
      <SwiperSlide class="w-full h-screen md:h-[820px]">
        <div class="flex flex-col w-full h-full py-8">
          <div class="flex flex-col px-6">
            <div class="flex items-center justify-center w-full mb-8 gap-x-6">
              <h2 class="text-lg font-semibold first-letter:uppercase">
                messages
              </h2>
            </div>
          </div>
          <Transition name="fade">
            <div class="relative w-full h-full p-8 text-center">
              <BaseInputFile
                v-if="!isLoader"
                :model-value="vFiles!"
                :validation="validationFiles"
                @update:model-value="getFiles"
              />
            </div>
          </Transition>
          <Transition name="fade">
            <BaseLoader
              v-if="isLoader"
              :is-loaded="isLoaded"
              @check-results="mySwiper!.slideNext()"
            />
          </Transition>
        </div>
      </SwiperSlide>
      <SwiperSlide class="w-full h-screen md:h-[820px]">
        <ResultSection
          :users="users"
          @slide-prev="mySwiper!.slidePrev()"
          @show-user="showUser"
        />
      </SwiperSlide>
      <SwiperSlide
        v-if="selectedUser !== null"
        class="w-full h-screen md:h-[820px]"
      >
        <div class="flex flex-col w-full h-full py-8 overflow-y-auto">
          <div class="flex flex-col px-6">
            <!-- Navigation -->
            <div class="flex items-center justify-between w-full mb-8 gap-x-6">
              <button
                class="flex items-center justify-center border border-gray-100 h-9 w-9 rounded-xl"
                @click="$emit('slidePrev')"
              >
                <BaseIcon
                  name="ChevronLeftIcon"
                  class="transition-colors duration-300"
                />
              </button>
              <h2 class="text-lg font-semibold first-letter:uppercase">
                messages
              </h2>
              <div class="h-9 w-9"></div>
            </div>

            <!-- Input search -->
            <!-- <BaseInputSearch v-model="vSearch" /> -->
          </div>

          <!-- Results -->
          <!-- <ul class="flex flex-col overflow-x-hidden gap-y-3">
            <UserItem
              v-for="user in filtredUsers"
              :item="user"
              :key="user.id"
              @click="$emit('showUser', user)"
            />
            <li
              v-if="!filtredUsers.length"
              class="px-8 text-sm text-gray-300 first-letter:uppercase"
            >
              There is no results :/
            </li>
          </ul> -->
        </div>
        {{ selectedUser }}
        <!-- <ResultSection
          :users="users"
          @slide-prev="mySwiper!.slidePrev()"
          @show-user="showUser"
        /> -->
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
import ResultSection from "../src/components/ResultSection.vue";

const mySwiper: Ref<SwiperType | null> = ref(null);
const setSwiper = (swiper: any) => {
  mySwiper.value = swiper;
};

const vFiles = ref<FileList | null>();
const isLoader = ref(false);
const isLoaded = ref(false);

const selectedUser = ref<User | null>(null);
const users: Ref<Array<User>> = ref([]);

const validationFiles = ref<Validation>({
  is: null,
  message: "",
});

const loadingUser = (state: "start" | "loaded" | "error") => {
  if (state === "start") {
    [
      isLoader.value,
      mySwiper.value!.allowSlideNext,
      mySwiper.value!.allowSlidePrev,
    ] = [true, false, false];
  } else if (state === "loaded") {
    [
      isLoaded.value,
      mySwiper.value!.allowSlideNext,
      mySwiper.value!.allowSlidePrev,
    ] = [true, true, true];
  } else {
    [
      isLoader.value,
      mySwiper.value!.allowSlideNext,
      mySwiper.value!.allowSlidePrev,
    ] = [false, true, true];

    validationFiles.value = {
      is: false,
      message: "Sorry, but I didn't find anything :/",
    };
  }
};

const getFiles = async (files: FileList) => {
  vFiles.value = files;

  if (files.length < 1) return;
  if (
    [...files].some(
      (item: File) =>
        item.type !== "application/x-zip-compressed" &&
        item.type !== "application/zip"
    )
  ) {
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
  for (let i = 0; i < files.length; i++) {
    await getDataFile(files[i]);
  }

  sortAndMapUsers();
  users.value.length > 0 ? loadingUser("loaded") : loadingUser("error");

  console.log("users", users.value);
};

const getDataFile = async (file: File) => {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = async (event) => {
      const blob = new Blob([event.target?.result!]);
      const reader = new zip.ZipReader(new zip.BlobReader(blob));
      let entries = (await reader.getEntries()) || [];

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
        const json = JSON.parse(await entry.getData?.(new zip.TextWriter())!);
        const userFolderName = entry.filename.split("/")[2];

        const index = users.value.findIndex(
          (item: User) => item.id === userFolderName
        );

        if (index > -1) {
          users.value[index].info.totalMessages += json.messages.length;
        } else {
          const user: User = {
            id: userFolderName,
            name: decodeText(json.title),
            ranking: 0,
            info: {
              totalMessages: json.messages.length,
              isGroup: json.thread_type === "RegularGroup",
              yourMessages: 0,
            },
          };

          users.value.push(user);
        }
      }

      await reader.close();
      resolve("Loaded");
    };

    reader.onerror = () => {
      resolve("Error");
    };

    reader.readAsArrayBuffer(file);
  });
};

const sortAndMapUsers = () => {
  users.value.sort(
    (a: User, b: User) => b.info.totalMessages - a.info.totalMessages
  );

  users.value = users.value.splice(0, 100);
  users.value = users.value.map((item: User, index: number) => ({
    ...item,
    ranking: index + 1,
  }));
};

const decodeText = (text: string) => {
  return new TextDecoder().decode(
    new Uint8Array(text.split("").map((r: any) => r.charCodeAt()))
  );
};

const resetLoader = () => {
  isLoader.value = false;
  isLoaded.value = false;
  vFiles.value = null;
};

const showUser = (user: User) => {
  selectedUser.value = user;
  setTimeout(() => {
    mySwiper.value?.slideTo(2);
  }, 200);
};
</script>
<style>
.fade-enter-active,
.fade-leave-active {
  @apply transition-opacity duration-500;
}

.fade-enter-from,
.fade-leave-to {
  @apply opacity-0;
}
</style>
