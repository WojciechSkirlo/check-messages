<template>
  <div>
    <div class="flex flex-col w-full h-full py-8 overflow-y-auto">
      <div class="flex flex-col px-6">
        <!-- Navigation -->
        <div class="flex items-center justify-between w-full mb-8 gap-x-8">
          <button class="flex items-center justify-center border border-gray-100 shrink-0 h-9 w-9 rounded-xl" @click="$emit('slidePrev')">
            <BaseIcon name="ChevronLeftIcon" class="transition-colors duration-300" />
          </button>
          <h2 class="text-lg font-semibold text-center truncate first-letter:uppercase">
            {{ user.name }}
          </h2>
          <div class="h-9 w-9"></div>
        </div>
        <div
          class="flex items-center justify-center w-full overflow-hidden bg-black h-14 rounded-xl shrink-0"
          :title="!user.info.isGroup ? 'Regular user' : 'Group'"
        >
          <img v-if="!user.info.isGroup" src="/user.png" alt="User" class="w-5.5 h-5.5 invert" />
          <img v-else src="/user-group.png" alt="Group" class="w-5.5 h-5.5 invert" />
        </div>
        <div class="flex flex-col px-4 mt-6 gap-y-3">
          <span class="text-sm text-gray-400">
            Ranking: <b class="text-base">{{ user.ranking }}</b>
          </span>
          <span class="text-sm text-gray-400">
            Conversation type:
            <b class="ml-2 text-base">
              {{ user.info.isGroup ? "Group" : "User" }}
            </b>
          </span>
          <span class="text-sm text-gray-400">
            Total messages:
            <b class="ml-2 text-base">{{ user.info.totalMessages }}</b>
          </span>
          <span class="text-sm text-gray-400">
            Your messages:
            <b class="ml-2 text-base">{{ user.info.yourMessages }}</b>
          </span>
          <span class="text-sm text-gray-400">
            Who start the conversation:
            <b class="ml-2 text-base">
              {{ user.info.whoStartConversation }}
            </b>
          </span>
          <span class="text-sm text-gray-400">
            First message date:
            <b class="ml-2 text-base">
              {{ firstMessageDate }}
            </b>
          </span>
          <span class="text-sm text-gray-400">
            Last message date:
            <b class="ml-2 text-base">
              {{ lastMessageDate }}
            </b>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { User } from "../../../types/index";
import { computed } from "vue";

defineEmits<{
  (e: "slidePrev"): void;
}>();

const props = defineProps<{
  user: User;
}>();

const firstMessageDate = computed(
  () =>
    `${new Date(props.user.info.dates.timestampFirstMessage).toLocaleDateString("pl")}  ${new Date(
      props.user.info.dates.timestampFirstMessage
    ).toLocaleTimeString("pl")}`
);

const lastMessageDate = computed(
  () =>
    `${new Date(props.user.info.dates.timestampLastMessage).toLocaleDateString("pl")}  ${new Date(
      props.user.info.dates.timestampLastMessage
    ).toLocaleTimeString("pl")}`
);

// const user: User = {
//   id: "asdasd",
//   name: "Kamil Palej",
//   ranking: 1,
//   info: {
//     isGroup: false,
//     totalMessages: 20222,
//     yourMessages: 0,
//     dates: { firstMessage: "asd", lastMessage: "asd" },
//   },
// };
</script>
