<template>
  <div
    class="absolute top-0 left-0 z-40 flex items-center justify-center w-full h-full bg-white"
  >
    <div class="flex flex-col items-center mb-12">
      <div
        class="flex items-center justify-center w-48 h-48 transform bg-black rounded-full bg-opacity-5"
        :class="!isLoaded ? 'animate-pulse-slow' : 'animate-pulse-slow-one'"
      >
        <div
          class="flex items-center justify-center bg-black rounded-full w-36 h-36 bg-opacity-10"
        >
          <div
            class="flex items-center justify-center w-24 h-24 transition-all duration-1000 bg-black rounded-full"
            :class="!isLoaded && 'animate-pulse-color'"
          >
            <svg
              v-if="isLoaded"
              class="fill-white"
              xmlns="http://www.w3.org/2000/svg"
              width="43"
              height="34"
              viewBox="0 0 43 34"
              fill="none"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M42.6232 3.9793L18.9715 33.5439L0.303223 17.987L4.19554 13.3163L18.0987 24.9022L37.8755 0.181152L42.6232 3.9793Z"
              />
            </svg>
          </div>
        </div>
      </div>
      <div class="flex flex-col items-center">
        <h3
          class="font-semibold text-center mt-14 first-letter:uppercase"
          v-text="
            isLoaded ? 'we succeeded!' : 'loading... (it may take some time)'
          "
        ></h3>
      </div>
      <Transition name="fade">
        <button
          v-if="isLoaded"
          type="button"
          @click="$emit('checkResults')"
          class="absolute flex justify-center w-48 px-8 py-5 text-sm text-white -translate-x-1/2 bg-black rounded-xl bottom-12 left-1/2 first-letter:uppercase"
        >
          Check the results 💬
        </button>
      </Transition>
    </div>
    <TheConfetti v-if="isLoaded" />
  </div>
</template>
<script setup lang="ts">
import TheConfetti from "../the/Confetti.vue";

defineEmits<{
  (e: "checkResults"): void;
}>();

defineProps<{
  isLoaded: boolean;
}>();
</script>
