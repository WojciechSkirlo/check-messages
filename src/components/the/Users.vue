<template>
  <div class="flex flex-col w-full h-full py-8 overflow-y-auto">
    <div class="flex flex-col px-6">
      <!-- Navigation -->
      <div class="flex items-center justify-between w-full mb-8 gap-x-6">
        <button class="flex items-center justify-center border border-gray-100 h-9 w-9 rounded-xl" @click="$emit('slidePrev')">
          <BaseIcon name="ChevronLeftIcon" class="transition-colors duration-300" />
        </button>
        <h2 class="text-lg font-semibold first-letter:uppercase">messages</h2>
        <div class="h-9 w-9"></div>
      </div>

      <!-- Input search -->
      <BaseInputSearch v-model="vSearch" />
    </div>

    <!-- Results -->
    <ul class="flex flex-col overflow-x-hidden gap-y-3">
      <UserItem v-for="user in filtredUsers" :item="user" :key="user.id" @click="$emit('showUser', user)" />
      <li v-if="!filtredUsers.length" class="px-8 text-sm text-gray-300 first-letter:uppercase">There is no results :/</li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from "vue";
import type { User } from "../../../types/index";
import UserItem from "./../UserItem.vue";

defineEmits<{
  (e: "slidePrev"): void;
  (e: "showUser", user: User): void;
}>();

const props = defineProps<{
  users: Array<User>;
}>();

const vSearch = ref("");

const filtredUsers = computed<Array<User>>(() => {
  return props.users.filter((item: User) => {
    let vSearchFormatted = vSearch.value.toLowerCase();
    return (
      item.name.toLowerCase().includes(vSearchFormatted) ||
      String(item.info.totalMessages).toLowerCase().includes(vSearchFormatted) ||
      String(item.ranking).toLowerCase().includes(vSearchFormatted)
    );
  });
});
</script>
