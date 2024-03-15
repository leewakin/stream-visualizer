<script setup lang="ts">
defineProps<{
  disabled?: boolean
}>()
</script>

<template>
  <button
    :disabled="disabled"
    class="inline-flex items-center gap-1 px-2 align-middle disabled:cursor-not-allowed disabled:opacity-60"
  >
    <!-- v-if="disabled" -->
    <span class="inline-block h-3 w-3 rounded-full bg-red-400"></span>

    return;
  </button>
</template>
