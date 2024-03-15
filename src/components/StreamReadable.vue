<script setup lang="ts">
import { ref } from 'vue'
import Card from './Card.vue'
import Item from './Item.vue'
import ButtonReturn from './ButtonReturn.vue'
import { strategy } from '../utils'
import Statement from './Statement.vue'

type StreamMethod = 'start' | 'pull' | 'cancel'

const activeMethodStatus = ref<Record<StreamMethod, boolean>>({
  start: false,
  pull: false,
  cancel: false
})

const size = ref('1')
const errorNotification = ref<string>()

const pullPromise = ref<PromiseWithResolvers<unknown> | null>(null)
const startPromise = ref(Promise.withResolvers())
const cancelCalledPromise = ref(Promise.withResolvers())
const cancelReturnedPromise = ref(Promise.withResolvers())
const streamController = ref<ReadableStreamDefaultController<string> | null>(
  null
)
const readableStream = ref(createStream())

function createStream() {
  return new ReadableStream(
    {
      start,
      pull,
      cancel
    },
    strategy
  )
}

function start(controller: ReadableStreamDefaultController<string>) {
  updateMethodStatus('start', true)
  streamController.value = controller

  return startPromise.value.promise.then(() => {
    updateMethodStatus('start', false)
    console.log('[ReadableStream] start() finished')
  })
}

function pull() {
  updateMethodStatus('pull', true)
  pullPromise.value = Promise.withResolvers()

  return pullPromise.value.promise.then(() => {
    updateMethodStatus('pull', false)
    pullPromise.value = null
    console.log('[ReadableStream] pull() finished')
  })
}

function cancel(reason: any) {
  updateMethodStatus('cancel', true)
  cancelCalledPromise.value.resolve(reason)

  return cancelReturnedPromise.value.promise.then(() => {
    updateMethodStatus('cancel', false)
    console.log('[ReadableStream] cancel() finished')
  })
}

function updateMethodStatus(method: StreamMethod, isActive: boolean) {
  activeMethodStatus.value[method] = isActive
}

function closeStream() {
  streamController.value?.close()
  errorNotification.value = '[ReadableStream] closed'
}

function triggerError() {
  streamController.value?.error('error from ReadableStream')
  errorNotification.value = '[ReadableStream] error'
}

const desiredSize = ref<number | null | undefined>(10)
function enqueue(size: string) {
  streamController.value?.enqueue(size)

  desiredSize.value = streamController.value?.desiredSize
}

defineExpose({
  readableStream
})
</script>

<template>
  <Item>
    <Card>
      <template #code>
        new ReadableStream({
        <Statement :active="activeMethodStatus.start">
          start() {
          <ButtonReturn
            :disabled="!activeMethodStatus.start"
            @click="startPromise.resolve(undefined)"
          />
          },
        </Statement>

        <Statement :active="activeMethodStatus.pull">
          pull() {
          <ButtonReturn
            :disabled="!activeMethodStatus.pull"
            @click="pullPromise?.resolve(undefined)"
          />
          },
        </Statement>

        <Statement :active="activeMethodStatus.cancel">
          cancel() {
          <ButtonReturn
            :disabled="!activeMethodStatus.cancel"
            @click="cancelReturnedPromise?.resolve(undefined)"
          />
          },
        </Statement>

        }, {
        <div class="pl-4">highWaterMark: {{ strategy.highWaterMark }},</div>
        })
      </template>
      <template #controll>
        <div class="flex flex-col gap-y-2">
          <div>
            <div>desiredSize = {{ desiredSize }}</div>
          </div>
          <div class="flex items-center gap-x-2">
            <button @click="enqueue(size)">enqueue()</button>
            <div class="text-nowrap">with size:</div>
            <input v-model="size" type="number" class="w-full" />
          </div>
          <div class="flex items-center gap-x-2">
            <button @click="closeStream">close()</button>
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
