<template>
  <div class="flex flex-col items-center justify-center w-full h-full">
    <input id="input-file" type="file" multiple accept="application/x-zip-compressed, application/zip"
      class="block text-sm text-gray-300 file:py-3 file:cursor-pointer file:mr-4 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white"
      @change="$emit('update:modelValue', ($event.target as HTMLInputElement).files)" />
  </div>
</template>
<script setup lang="ts">
defineEmits<{
  (e: "update:modelValue", value: any): void
}>();
</script>