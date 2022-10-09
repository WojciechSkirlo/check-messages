<script setup lang="ts">
import * as zip from "@zip.js/zip.js";

import { ref } from "vue";
const participants: any = ref("");
const qtyOfMessages: any = ref("");

const d = (s: string) => new TextDecoder().decode(new Uint8Array(s.split('').map((r: any) => r.charCodeAt())))


const getFiles = async (e: any) => {
  const reader = new FileReader();

  console.log(e.target.files, "e");

  reader.onload = async (event) => {
    // console.log("event", event.target.f)
    // const zip = event.target?.result!;
    const blob = new Blob([event.target?.result!])
    const reader = new zip.ZipReader(new zip.BlobReader(blob));
    let entries = await reader.getEntries() || [];

    // entries = entries.filter((item: any) => !item.directory);
    if (entries.length) {

      const text = await entries[0].getData(new zip.TextWriter());
      // text contains the entry data as a String
      console.log(text);
    }

    console.log(entries, "entries");

    await reader.close();
    // const zipFileReader = new BlobReader(blob);
    // const zipReader = new ZipReader(zipFileReader);

    // const firstEntry = await zipReader.getEntries();



    // console.log(firstEntry)

    // console.log(zipReader)
    // const reader = new zip.ZipReader(new zip.BlobReader(blob));

    // // get all entries from the zip
    // const entries = await reader.getEntries();
    // if (entries.length) {

    //   // get first entry content as text by using a TextWriter
    //   const text = await entries[0].getData(
    //     // writer
    //     new zip.TextWriter(),
    //     // options
    //     {
    //       onprogress: (index, max) => {
    //         // onprogress callback
    //       }
    //     }
    //   );
    //   // text contains the entry data as a String
    //   console.log(text);
    // }

    // console.log("e", event);
    // const csv: string = 
    // let result = e.target?.result!
    // result = typeof result === 'string' ? result : result.toString();
    // participants.value = JSON.parse(result).participants;
    // qtyOfMessages.value = JSON.parse(result).messages.length;
    // console.log("result:", JSON.parse(result));
  }

  reader.readAsArrayBuffer(e.target?.files[0]);

  // Displays "Hello world!".
  // console.log(helloWorldText);




  // reader.onload = (e) => {
  //   console.log(e.target?.result);
  // }

  // console.log([...file.target?.files].filter((item: any) => item.type === 'application/json'))



  // console.log("file", file.target.files[0])
}

// const reader = new FileReader();

</script>

<template>
  <main class="bg-red-200">
    <input type="file" @change="getFiles" />
    <div v-if="participants">
      <span>Participants:</span>
      {{d(participants[0].name)}} |
      {{d(participants[1].name)}}
    </div>
    <div v-if="participants">
      <span>Quantity of messages:</span>
      {{qtyOfMessages}}
    </div>
  </main>
</template>
