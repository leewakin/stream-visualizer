<script setup lang="ts">
import { ref } from 'vue'

interface Stack {
  chunk: string
  key: number
}
const delay = '1500ms'
const stacks = ref<Stack[]>([])
let count = 1

const transformStream = new TransformStream({
  transform(chunk, controller) {
    ;(async function () {
      stacks.value.push({
        chunk,
        key: count++
      })

      // 动画
      await new Promise(r => setTimeout(r, parseInt(delay, 10)))
      stacks.value.shift()
      controller.enqueue(chunk)
    })()
  }
})

defineExpose({
  transformStream
})
</script>

<template>
  <ul class="relative w-10 self-end">
    <!-- <TransitionGroup name="chunks" tag="ul">
      <li v-for="item in stacks" class="">
        {{ item }}
      </li>
    </TransitionGroup> -->
    {{
      stacks.length
    }}
    <li
      v-for="item in stacks"
      :key="item.key"
      class="chunks absolute bottom-0 flex h-8 w-8 items-center justify-center rounded-full bg-sky-300"
      :style="{}"
    >
      {{ item.chunk }}
    </li>
  </ul>
</template>

<style scoped>
.chunks {
  animation: fall v-bind(delay) linear;
}

@keyframes fall {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  90% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translateY(16rem);
  }
}

/* .chunks-enter-active,
.chunks-leave-active {
  transition: all 0.5s ease;
}
.chunks-enter-from,
.chunks-leave-to {
  transform: translateY(30px);
} */
</style>
