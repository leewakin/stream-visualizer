<script setup lang="ts">
import { onMounted, ref } from 'vue'

import StreamReadable from './components/StreamReadable.vue'
import StreamTransform from './components/StreamTransform.vue'
import StreamWritable from './components/StreamWritable.vue'
import LogList from './components/LogList.vue'
import Container from './components/Container.vue'

import { createAnimationStream } from './utils'

const readableRef = ref<InstanceType<typeof StreamReadable>>()
const transformRef = ref<InstanceType<typeof StreamTransform>>()
const writeableRef = ref<InstanceType<typeof StreamWritable>>()
const readableChunkRef = ref<HTMLDivElement>()
const transformChunkRef = ref<HTMLDivElement>()
const writeableChunkRef = ref<HTMLDivElement>()

function init() {
  const { readableStream } = readableRef.value!
  const { transformStream } = transformRef.value!
  const { writableStream } = writeableRef.value!
  readableStream!
    .pipeThrough(
      createAnimationStream(readableChunkRef.value!, transformChunkRef.value!)
    )
    .pipeThrough(transformStream!)
    .pipeThrough(
      createAnimationStream(transformChunkRef.value!, writeableChunkRef.value!)
    )
    .pipeTo(writableStream!)
}

onMounted(init)
</script>

<template>
  <div class="relative flex min-w-96 flex-col gap-3 border-r">
    <Container>
      <StreamReadable ref="readableRef" />

      <div ref="readableChunkRef" class="w-10"></div>
    </Container>
    <Container>
      <StreamTransform ref="transformRef" />

      <div ref="transformChunkRef" class="w-10"></div>
    </Container>

    <Container>
      <StreamWritable ref="writeableRef" />

      <div ref="writeableChunkRef" class="w-10"></div>
    </Container>

    <LogList />
  </div>
</template>
