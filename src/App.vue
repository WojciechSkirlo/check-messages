<template>
  <main class="flex flex-col w-full min-h-screen px-6 py-8 bg-[#F5F5F5]">
    <div class="w-full p-4 mb-8 text-center bg-white rounded-xl">
      <input type="file" multiple @change="getFiles" />
    </div>
    <div v-if="!isLoader" class="flex flex-col gap-y-5">
      <PersonItem v-for="(item, index) in persons" :item="item" :index="index" :key="index" />
    </div>
    <div v-else>Loader</div>
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

const persons: Ref<Array<Person>> = ref([]);
const isLoader = ref(true);

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
        // || folderName === "archived_threads";
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
    isLoader.value = false;
    console.log("pers", persons.value)

    await reader.close();
  };


  reader.readAsArrayBuffer(e.target?.files[0]);
};
</script>
