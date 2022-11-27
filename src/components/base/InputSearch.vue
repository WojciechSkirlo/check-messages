<template>
  <div
    class="flex items-center w-full gap-4 px-6 py-4.5 mb-6 border border-gray-100 rounded-xl"
  >
    <input
      type="text"
      :value="modelValue"
      placeholder="Search user"
      class="flex-1 order-1 text-sm outline-none peer placeholder:text-gray-200"
      @input="
        $emit('update:modelValue', ($event.target as HTMLInputElement).value)
      "
    />
    <BaseIcon
      name="MagnifyingGlassIcon"
      class="transition-colors duration-300 peer-focus:fill-black fill-gray-200"
    />
  </div>
</template>
<script setup lang="ts">
defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

defineProps<{
  modelValue: string;
}>();
</script>
