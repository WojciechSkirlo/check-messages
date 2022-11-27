<template>
  <component
    :is="HeroIcons[name]"
    :class="
      bigger
        ? 'w-6 h-6'
        : smaller
        ? 'w-4 h-4'
        : smallest
        ? 'w-3.5 h-3.5'
        : 'w-5 h-5'
    "
  ></component>
</template>
<script setup lang="ts">
import * as HeroIcons from "@heroicons/vue/24/solid/index.js";

defineProps<{
  name: keyof typeof HeroIcons;
  bigger?: boolean;
  smaller?: boolean;
  smallest?: boolean;
}>();
</script>
