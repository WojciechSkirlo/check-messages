<template>
  <div class="flex items-center w-full px-6 py-4 transition-colors duration-300 gap-x-6 hover:bg-gray-50">
    <div class="w-12 h-12 overflow-hidden bg-gray-100 rounded-full shrink-0">
      <!-- <img
        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cG9ydHJhaXR8ZW58MHx8MHx8&w=1000&q=80"
        alt="" class="object-cover w-full h-full" /> -->
    </div>
    <div class="flex flex-col w-[calc(100%-70px)]">
      <div class="flex items-center justify-between w-full gap-x-5">
        <h3 class="min-w-0 font-medium truncate">{{decodeText(item.name)}}</h3>
        <div
          class="flex justify-center align-bottom items-center min-w-[27px] h-6 px-4 text-xs rounded-full whitespace-nowrap"
          :class="index + 1 <= 3 ? 'bg-black text-white border border-black' :'border border-gray-100'">
          {{index + 1}}
        </div>
      </div>
      <div class="self-start px-5 py-1 mt-3 text-sm border border-gray-100 rounded-full">
        <b class="mr-3">{{ item.totalMessages }}</b>
        <span class="text-gray-400">messages</span>
      </div>
    </div>

    <!-- I dont know does i like this view -->
    <!-- :class="index + 1 === 1 ? 'bg-[#fde68a] text-black' : index + 1 === 2 ? 'bg-gray-200 text-black' : index + 1 === 3 ? 'bg-[#d97706] text-vlack' :'text-white bg-black'"> -->
  </div>
</template>
<script setup lang="ts">
interface Person {
  id: string,
  name: string,
  totalMessages: number,
}

defineProps<{
  item: Person;
  index: number,
}>();

const decodeText = (string: string) =>
  new TextDecoder().decode(
    new Uint8Array(string.split("").map((r: any) => r.charCodeAt()))
  );
</script>
