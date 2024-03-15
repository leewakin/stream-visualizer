<script setup lang="ts"></script>

<template>
  <div
    class="grid flex-1 grid-cols-2 gap-4 rounded-md border border-black bg-green-200 p-2"
  >
    <code>
      <slot name="code"></slot>
    </code>

    <div class="p-1 pt-2">
      <div
        class="h-full w-full border border-black/40 p-2 shadow-inner before:relative before:-top-5 before:left-2 before:bg-green-200 before:px-1 before:content-['Controller']"
      >
        <slot name="controll"></slot>
      </div>
    </div>
  </div>
</template>
