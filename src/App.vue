<template>
  <main class="w-full bg-white md:max-w-[390px] md:border md:border-black">
    <Swiper
      class="w-full h-full mySwiper"
      @swiper="setSwiper"
      @slide-change-transition-end="resetFileSection"
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
              <BaseInputFile v-if="!isLoader" @update:model-value="getFiles" />
            </div>
          </Transition>
          <Transition name="fade">
            <BaseLoader
              v-if="isLoader"
              :is-loaded="isLoaded"
              @check-results="mySwiper.slideNext()"
            />
          </Transition>
        </div>
      </SwiperSlide>
      <SwiperSlide class="w-full h-screen md:h-[820px]">
        <ResultSection :users="users" @slide-prev="mySwiper.slidePrev()" />
      </SwiperSlide>
    </Swiper>
  </main>
</template>

<script setup lang="ts">
import * as zip from "@zip.js/zip.js";
import { ref } from "vue";
import type { Ref } from "vue";
import type { User } from "../types/User";
import BaseInputFile from "../src/components/BaseInputFile.vue";
import BaseLoader from "../src/components/BaseLoader.vue";
import ResultSection from "../src/components/ResultSection.vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";

const mySwiper: Ref<any> = ref(null);
const setSwiper = (swiper: any) => {
  mySwiper.value = swiper;
};

const isLoader = ref(false);
const isLoaded = ref(false);

const users: Ref<Array<User>> = ref([]);

const getFiles = async (files: any) => {
  if (files.length < 1) return;
  isLoader.value = true;
  mySwiper.value.allowSlideNext = false;

  if (users.value.length > 0) users.value = [];
  console.log("files", files);

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

        console.log("json", json);

        users.value.push(user);
      }
    }

    users.value.sort(
      (a: User, b: User) => b.info.totalMessages - a.info.totalMessages
    );
    users.value = users.value.splice(0, 100);
    users.value = users.value.map((item: User, index: number) => ({
      ...item,
      ranking: index + 1,
    }));

    console.log("pers", users.value);

    await reader.close();
    isLoaded.value = true;
    mySwiper.value.allowSlideNext = true;
  };

  reader.readAsArrayBuffer(files[0]);
};

const decodeText = (string: string) =>
  new TextDecoder().decode(
    new Uint8Array(string.split("").map((r: any) => r.charCodeAt()))
  );

const resetFileSection = () => {
  isLoader.value = false;
  isLoaded.value = false;
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
