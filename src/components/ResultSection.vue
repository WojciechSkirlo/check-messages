<template>
  <div class="flex flex-col w-full h-full py-8 overflow-y-auto">
    <div class="flex flex-col px-6">
      <!-- Navigation -->
      <div class="flex items-center justify-between w-full mb-8 gap-x-6">
        <button
          class="flex items-center justify-center border border-gray-100 h-9 w-9 rounded-xl"
          @click="$emit('slidePrev')"
        >
          <svg
            width="7"
            height="13"
            viewBox="0 0 7 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M6.74372 0.256282C6.40201 -0.0854272 5.84799 -0.0854272 5.50628 0.256282L0.256282 5.50628C-0.0854273 5.84799 -0.0854273 6.40201 0.256282 6.74372L5.50628 11.9937C5.84799 12.3354 6.40201 12.3354 6.74372 11.9937C7.08543 11.652 7.08543 11.098 6.74372 10.7563L2.11244 6.125L6.74372 1.49372C7.08543 1.15201 7.08543 0.59799 6.74372 0.256282Z"
              fill="#101010"
            />
          </svg>
        </button>
        <h2 class="text-lg font-semibold first-letter:uppercase">messages</h2>
        <div class="h-9 w-9"></div>
      </div>

      <!-- Input search -->
      <BaseInputSearch v-model="vSearch" />
    </div>

    <!-- Results -->
    <ul class="flex flex-col overflow-x-hidden gap-y-3">
      <UserItem
        v-for="item in filtredUsers"
        :item="item"
        :key="item.id"
        @click="showUser(item)"
      />
      <li
        v-if="!filtredUsers.length"
        class="px-8 text-sm text-gray-300 first-letter:uppercase"
      >
        There is no results :/
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from "vue";
import type { Ref } from "vue";
import type { User } from "../../types/index";
import UserItem from "./UserItem.vue";
import BaseInputSearch from "../../src/components/BaseInputSearch.vue";

defineEmits<{
  (e: "slidePrev"): void;
}>();

const props = defineProps<{
  users: Array<User>;
}>();

const vSearch: Ref<string> = ref("");

const filtredUsers = computed<Array<User>>(() => {
  return props.users.filter((item: User) => {
    let vSearchFormatted = vSearch.value.toLowerCase();
    return (
      item.name.toLowerCase().includes(vSearchFormatted) ||
      String(item.info.totalMessages)
        .toLowerCase()
        .includes(vSearchFormatted) ||
      String(item.ranking).toLowerCase().includes(vSearchFormatted)
    );
  });
});

const showUser = (user: User) => {
  console.log("user to show", user);
};
</script>
