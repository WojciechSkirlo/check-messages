<template>
  <div class="flex flex-col items-center justify-center w-full h-full">
    <div class="flex flex-col">
      <label for="input-file" class="flex items-center text-sm gap-x-4">
        <div
          type="button"
          class="px-6 py-3 font-semibold text-white bg-black rounded-full cursor-pointer shrink-0"
        >
          Select files
        </div>
        <span class="text-left text-gray-300 truncate max-w-36">
          {{ selectFiles }}
        </span>
      </label>
      <input
        id="input-file"
        type="file"
        multiple
        accept="application/x-zip-compressed, application/zip"
        class="hidden"
        @change="
          $emit('update:modelValue', ($event.target as HTMLInputElement).files)
        "
      />
      <span
        v-if="validation.is === false"
        class="mt-4 ml-3 text-sm text-left text-error"
      >
        {{ validation.message }}
      </span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from "vue";
import type { Validation } from "../../../types/index";

defineEmits<{
  (e: "update:modelValue", value: any): void;
}>();

const props = defineProps<{
  modelValue: FileList;
  validation: Validation;
}>();

const selectFiles = computed(() =>
  props.modelValue?.length > 0
    ? `${[...props.modelValue].map((item: File) => item.name)[0]} (${
        props.modelValue.length
      })`
    : "No file selected"
);
</script>
