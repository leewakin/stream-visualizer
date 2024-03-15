<script setup lang="ts">
import { ref } from 'vue'
import Card from './Card.vue'
import Item from './Item.vue'
import ButtonReturn from './ButtonReturn.vue'
import { strategy } from '../utils'
import Statement from './Statement.vue'

type StreamMethod = 'start' | 'transform' | 'flush'
const activeMethodStatus = ref<Record<StreamMethod, boolean>>({
  start: false,
  transform: false,
  flush: false
})

const autoReturn = ref(false)
const size = ref('1')
const errorNotification = ref<string>()

const transformReturnPromise = ref<PromiseWithResolvers<unknown> | null>(null)
const startPromise = ref(Promise.withResolvers())
const flushCalledPromise = ref(Promise.withResolvers())
const flushReturnedPromise = ref(Promise.withResolvers())
const streamController = ref<TransformStreamDefaultController<string> | null>(
  null
)
const transformStream = ref(createStream())

function createStream() {
  return new TransformStream(
    {
      start,
      transform,
      flush
    },
    strategy,
    strategy
  )
}

function start(controller: TransformStreamDefaultController<string>) {
  updateMethodStatus('start', true)
  streamController.value = controller

  return startPromise.value.promise.then(() => {
    updateMethodStatus('start', false)
    console.log('[TransformStream] start() finished')
  })
}

function transform(chunk: string) {
  updateMethodStatus('transform', true)
  transformReturnPromise.value = Promise.withResolvers()

  if (autoReturn.value) {
    transformReturnPromise.value.resolve(undefined)
  }

  return transformReturnPromise.value.promise.then(() => {
    updateMethodStatus('transform', false)
    streamController.value?.enqueue(chunk)
    transformReturnPromise.value = null

    console.log('[TransformStream] transform() finished')
  })
}

function flush() {
  updateMethodStatus('flush', true)
  flushCalledPromise.value.resolve(undefined)

  return flushReturnedPromise.value.promise.then(() => {
    updateMethodStatus('flush', false)
    console.log('[TransformStream] flush() finished')
  })
}

function updateMethodStatus(method: StreamMethod, isActive: boolean) {
  activeMethodStatus.value[method] = isActive
}

function terminate() {
  streamController.value?.terminate()
  errorNotification.value = '[TransformStream] terminate'
}

function triggerError() {
  streamController.value?.error('error from TransformStream')
  errorNotification.value = '[TransformStream] error'
}

const desiredSize = ref<number | null | undefined>(10)
function enqueue(size: string) {
  streamController.value!.enqueue(size)

  desiredSize.value = streamController.value!.desiredSize
}

defineExpose({
  transformStream
})
</script>

<template>
  <Item>
    <Card>
      <template #code>
        .pipeThrough(new TransformStream({
        <Statement :active="activeMethodStatus.start">
          start() {
          <ButtonReturn
            :disabled="!activeMethodStatus.start"
            @click="startPromise.resolve(undefined)"
          />
          },
        </Statement>

        <Statement :active="activeMethodStatus.transform">
          transform() {
          <ButtonReturn
            :disabled="!activeMethodStatus.transform"
            @click="transformReturnPromise?.resolve(undefined)"
          />
          },
        </Statement>

        <Statement :active="activeMethodStatus.flush">
          flush() {
          <ButtonReturn
            :disabled="!activeMethodStatus.flush"
            @click="flushReturnedPromise?.resolve(undefined)"
          />
          },
        </Statement>

        }, {
        <div class="pl-4">highWaterMark: {{ strategy.highWaterMark }},</div>
        }, {
        <div class="pl-4">highWaterMark: {{ strategy.highWaterMark }},</div>
        })
      </template>
      <template #controll>
        <div class="flex flex-col gap-y-2">
          <div>desiredSize = {{ desiredSize }}</div>
          <div>
            <label class="flex items-center gap-x-1">
              <input type="checkbox" v-model="autoReturn" />
              auto return form transform()
            </label>
          </div>
          <div class="flex items-center gap-x-2">
            <button @click="enqueue(size)">enqueue()</button>
            <div class="text-nowrap">with size:</div>
            <input v-model="size" type="number" class="w-full" />
          </div>
          <div class="flex items-center gap-x-2">
            <button @click="terminate">terminate()</button>
            <button @click="triggerError">error()</button>
          </div>
          <p v-if="errorNotification" class="text-red-400">
            {{ errorNotification }}
          </p>
        </div>
      </template>
    </Card>
  </Item>
</template>
