<template>
  <div
    class="flex items-center h-20 gap-4 transition-colors duration-300 p-[15px] pr-[18px] rounded-[15px] bg-[#F9F9F9] border border-white shadow-custom">
    <div class="w-[50px] h-[50px] bg-gray-200 rounded-[15px]" style="box-shadow: 2px 2px 6px 0 rgba(0, 0, 0, 0.08)">
      <img
        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cG9ydHJhaXR8ZW58MHx8MHx8&w=1000&q=80"
        alt="" class="object-cover w-full h-full rounded-[15px]" />
    </div>
    <div class="flex flex-1">
      <div class="p-2 text-white bg-black">{{index + 1}}</div>
      <div class="bg-red-200">{{ item.totalMessages }}</div>
      <div class="ml-3 bg-red-200">{{ decodeText(item.name) }}</div>
      <div></div>
    </div>
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
