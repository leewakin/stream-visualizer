<script setup lang="ts">
import { onMounted, ref } from 'vue'

import StreamReadable from './components/StreamReadable.vue'
import StreamTransform from './components/StreamTransform.vue'
import StreamWritable from './components/StreamWritable.vue'
import Log from './components/Log.vue'

import { createLogoStream } from './utils'

const readableRef = ref<InstanceType<typeof StreamReadable>>()
const transformRef = ref<InstanceType<typeof StreamTransform>>()
const writeableRef = ref<InstanceType<typeof StreamWritable>>()

function init() {
  const { readableStream } = readableRef.value!
  const { transformStream } = transformRef.value!
  const { writableStream } = writeableRef.value!
  readableStream!
    .pipeThrough(createLogoStream())
    .pipeThrough(transformStream!)
    .pipeThrough(createLogoStream())
    .pipeTo(writableStream!)
}

onMounted(() => {
  init()
})
</script>

<template>
  <div class="relative min-w-96 border-r">
    <StreamReadable ref="readableRef" />
    <StreamTransform ref="transformRef" />
    <StreamWritable ref="writeableRef" />
    <Log />
  </div>
</template>
