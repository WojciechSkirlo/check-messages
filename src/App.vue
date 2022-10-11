<template>
  <main class="flex flex-col w-full min-h-screen py-8 bg-white">

    <!-- File page -->
    <!-- <TransitionGroup tag="div" name="slide" class="flex"> -->
    <div v-if="isFilePage" @click="isFilePage = false" class="w-full p-4 mb-8 text-center bg-gray-300 rounded-xl">
      <!-- <input type="file" multiple @change="getFiles" /> -->
    </div>

    <!-- Result page -->
    <div v-else class="flex flex-col">
      <div class="flex flex-col px-6">
        <!-- Navigation -->
        <div class="flex items-center justify-between w-full mb-8 gap-x-6">
          <button class="flex items-center justify-center border border-gray-100 h-9 w-9 rounded-xl"
            @click="isFilePage = true;">
            <svg width="7" height="13" viewBox="0 0 7 13" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M6.74372 0.256282C6.40201 -0.0854272 5.84799 -0.0854272 5.50628 0.256282L0.256282 5.50628C-0.0854273 5.84799 -0.0854273 6.40201 0.256282 6.74372L5.50628 11.9937C5.84799 12.3354 6.40201 12.3354 6.74372 11.9937C7.08543 11.652 7.08543 11.098 6.74372 10.7563L2.11244 6.125L6.74372 1.49372C7.08543 1.15201 7.08543 0.59799 6.74372 0.256282Z"
                fill="#101010" />
            </svg>
          </button>
          <h2 class="text-lg font-semibold first-letter:uppercase">messages top 100</h2>
          <div class="h-9 w-9"></div>
        </div>

        <!-- Input -->
        <div class="flex items-center w-full gap-4 px-6 py-4.5 mb-6 border border-gray-100 rounded-xl">
          <input type="text" placeholder="Search user"
            class="flex-1 order-1 text-sm outline-none peer placeholder:text-gray-200" />
          <svg width="11" height="11" viewBox="0 0 11 11" fill="#00ffff" xmlns="http://www.w3.org/2000/svg"
            class="transition-colors duration-300 peer-focus:fill-black fill-gray-200">
            <path
              d="M4.70412 9.40774C5.74783 9.40753 6.76147 9.05814 7.58363 8.41522L10.1685 11L11 10.1686L8.41508 7.58381C9.05837 6.76162 9.40799 5.7478 9.40824 4.70387C9.40824 2.11027 7.29786 0 4.70412 0C2.11039 0 0 2.11027 0 4.70387C0 7.29747 2.11039 9.40774 4.70412 9.40774ZM4.70412 1.17597C6.64986 1.17597 8.23221 2.75823 8.23221 4.70387C8.23221 6.64951 6.64986 8.23177 4.70412 8.23177C2.75838 8.23177 1.17603 6.64951 1.17603 4.70387C1.17603 2.75823 2.75838 1.17597 4.70412 1.17597Z" />
          </svg>
        </div>
      </div>

      <!-- Results -->
      <div class="flex flex-col gap-y-3">
        <PersonItem v-for="(item, index) in persons" :item="item" :index="index" :key="item.id" />
      </div>
    </div>
    <!-- </TransitionGroup> -->
  </main>
</template>

<script setup lang="ts">
import * as zip from "@zip.js/zip.js";
import { ref } from "vue";
import type { Ref } from 'vue'
import PersonItem from "../src/components/PersonItem.vue";

interface Person {
  id: string,
  name: string,
  totalMessages: number,
}

const persons: Ref<Array<Person>> = ref([
  { id: 'wdasd', name: 'Rock JD 1', totalMessages: 1 },
  { id: 'wdasd 2123', name: 'Rock JD 2 asd3  dqw 12 d12d d12 d 12', totalMessages: 1 },
  { id: 'wdasd 2', name: 'Rock JD 3', totalMessages: 1 },
  { id: 'wdasd 3', name: 'Rock JD 4', totalMessages: 1 },
  { id: 'wdasd 4', name: 'Rock JD 4', totalMessages: 1 },
  { id: 'wdasd 5', name: 'Rock JD 4', totalMessages: 1 },
  { id: 'wdasd 6', name: 'Rock JD 4', totalMessages: 1 },
  { id: 'wdasd 7', name: 'Rock JD 4', totalMessages: 1 },
]);

const isFilePage = ref(true);

const getFiles = async (e: any) => {
  const reader = new FileReader();

  console.log(e.target.files, "e");

  reader.onload = async (event) => {
    const blob = new Blob([event.target?.result!]);
    const reader = new zip.ZipReader(new zip.BlobReader(blob));
    let entries = await reader.getEntries() || [];

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
        return folderName === "inbox"
          || folderName === "archived_threads";
      }
    });


    for (const entry of entries) {
      const json = JSON.parse(await entry.getData?.(new zip.TextWriter())!);
      const userFolderName = entry.filename.split("/")[2];

      const index = persons.value.findIndex((item: Person) => item.id === userFolderName);
      if (index > -1) {
        persons.value[index].totalMessages += json.messages.length;
      } else {
        const person: Person = {
          id: userFolderName,
          name: json.title,
          totalMessages: json.messages.length,
        }

        persons.value.push(person)
      }
    }

    persons.value.sort((a: Person, b: Person) => b.totalMessages - a.totalMessages);
    persons.value = persons.value.splice(0, 100);
    isFilePage.value = false;
    console.log("pers", persons.value)

    await reader.close();
  };


  reader.readAsArrayBuffer(e.target?.files[0]);
};
</script>