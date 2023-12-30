<template>
  <li class="flex items-center w-full px-6 py-4 transition-colors duration-300 cursor-pointer gap-x-6 hover:bg-gray-50">
    <div
      class="flex items-center justify-center w-12 h-12 overflow-hidden bg-black rounded-[15px] shrink-0"
      :title="!item.info.isGroup ? 'Regular user' : 'Group'"
    >
      <img v-if="!item.info.isGroup" src="/user.png" alt="User" class="w-5.5 h-5.5 invert" />
      <img v-else src="/user-group.png" alt="Group" class="w-5.5 h-5.5 invert" />
    </div>
    <div class="flex flex-col w-[calc(100%-70px)]">
      <div class="flex items-center justify-between w-full gap-x-5">
        <h3 class="min-w-0 font-medium truncate" :title="item.name">
          {{ $decode(item.name) }}
        </h3>
        <div
          v-if="item.ranking"
          class="flex justify-center align-bottom items-center shrink-0 min-w-[27px] h-6 px-4 text-xs rounded-full whitespace-nowrap"
          :class="item.ranking <= 3 ? 'bg-black text-white border border-black' : 'border border-gray-100'"
          :title="`${item.ranking} place in ranking`"
        >
          {{ item.ranking }}
        </div>
      </div>
      <div class="self-start px-5 py-1 mt-3 text-sm border border-gray-100 rounded-full">
        <b class="mr-3">{{ item.info.totalMessages }}</b>
        <span class="text-gray-400">messages</span>
      </div>
    </div>
  </li>
</template>

<script setup lang="ts">
import type { User } from "../../types/index";

defineProps<{
  item: User;
}>();
</script>
