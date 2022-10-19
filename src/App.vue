<template>
  <main class="w-full bg-white md:max-w-[390px] md:border md:border-black">
    <swiper class="w-full h-full mySwiper" @swiper="setSwiper" @slide-change-transition-end="resetFileSection">
      <swiper-slide class="w-full h-screen md:h-[820px]">
        <div class="flex flex-col w-full h-full py-8">
          <div class="flex flex-col px-6">
            <div class="flex items-center justify-center w-full mb-8 gap-x-6">
              <h2 class="text-lg font-semibold first-letter:uppercase">messages</h2>
            </div>
          </div>
          <Transition name="fade">
            <div class="relative w-full h-full p-8 text-center">
              <BaseInputFile v-if="!isLoader" @update:model-value="getFiles" />
            </div>
          </Transition>
          <Transition name="fade">
            <BaseLoader v-if="isLoader" :is-loaded="isLoaded" @check-results="mySwiper.slideNext()" />
          </Transition>
        </div>
      </swiper-slide>
      <swiper-slide class="w-full h-screen md:h-[820px]">
        <ResultSection :persons="persons" @slide-prev="mySwiper.slidePrev()" />
      </swiper-slide>
    </swiper>
  </main>
</template>

<script setup lang="ts">
import * as zip from "@zip.js/zip.js";
import { ref } from "vue";
import type { Ref } from "vue";
import BaseInputFile from "../src/components/BaseInputFile.vue";
import BaseLoader from "../src/components/BaseLoader.vue";
import ResultSection from "../src/components/ResultSection.vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import type { Person } from "../types/Person";

const mySwiper: Ref<any> = ref(null);
const setSwiper = (swiper: any) => {
  mySwiper.value = swiper;
};

const isLoader = ref(false);
const isLoaded = ref(false);

const persons: Ref<Array<Person>> = ref([]);

const getFiles = async (files: any) => {
  if (files.length < 1) return;
  isLoader.value = true;
  mySwiper.value.allowSlideNext = false;

  if (persons.value.length > 0) persons.value = [];
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

      const index = persons.value.findIndex(
        (item: Person) => item.id === userFolderName
      );
      if (index > -1) {
        persons.value[index].totalMessages += json.messages.length;
      } else {
        const person: Person = {
          id: userFolderName,
          name: json.title,
          totalMessages: json.messages.length,
        };

        persons.value.push(person);
      }
    }

    persons.value.sort(
      (a: Person, b: Person) => b.totalMessages - a.totalMessages
    );
    persons.value = persons.value.splice(0, 100);

    console.log("pers", persons.value);

    await reader.close();
    isLoaded.value = true;
    mySwiper.value.allowSlideNext = true;
  };

  reader.readAsArrayBuffer(files[0]);
};

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
