<script setup lang="ts">
defineProps<{
  active: boolean
}>()
</script>

<template>
  <div
    class="py-1 pl-4 [&+&]:mt-1"
    :class="{
      'bg-yellow-100': active
    }"
  >
    <slot />
  </div>
</template>
