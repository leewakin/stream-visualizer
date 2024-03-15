<script setup lang="ts">
import { ref } from 'vue'
import Card from './Card.vue'
import Item from './Item.vue'
import ButtonReturn from './ButtonReturn.vue'
import { strategy } from '../utils'
import Statement from './Statement.vue'

type StreamMethod = 'start' | 'write' | 'abort' | 'close'

const activeMethodStatus = ref<Record<StreamMethod, boolean>>({
  start: false,
  write: false,
  abort: false,
  close: false
})

const autoReturn = ref(false)
const errorNotification = ref<string>()
const writeReturnPromise = ref<PromiseWithResolvers<unknown> | null>(null)
const startPromise = ref(Promise.withResolvers())
const abortCalledPromise = ref(Promise.withResolvers())
const abortReturnedPromise = ref(Promise.withResolvers())
const closeCalledPromise = ref(Promise.withResolvers())
const closeReturnedPromise = ref(Promise.withResolvers())
const streamController = ref<WritableStreamDefaultController | null>(null)
const writableStream = ref(createStream())

function createStream() {
  return new WritableStream(
    {
      start,
      write,
      abort,
      close
    },
    strategy
  )
}

function start(controller: WritableStreamDefaultController) {
  updateMethodStatus('start', true)
  streamController.value = controller

  return startPromise.value.promise.then(() => {
    updateMethodStatus('start', false)
    console.log('[WritableStream] start() finished')
  })
}

function write(chunk: string) {
  updateMethodStatus('write', true)
  writeReturnPromise.value = Promise.withResolvers()

  if (autoReturn.value) {
    writeReturnPromise.value.resolve(undefined)
  }

  console.log('[WritableStream] write() chunk: ', chunk)

  return writeReturnPromise.value.promise.then(() => {
    updateMethodStatus('write', false)
    writeReturnPromise.value = null

    console.log('[WritableStream] write() finished')
  })
}

function abort() {
  updateMethodStatus('abort', true)
  abortCalledPromise.value.resolve(undefined)

  return abortReturnedPromise.value.promise.then(() => {
    updateMethodStatus('abort', false)
    console.log('[WritableStream] abort() finished')
  })
}

function close() {
  updateMethodStatus('close', true)
  closeCalledPromise.value.resolve(undefined)

  return closeReturnedPromise.value.promise.then(() => {
    updateMethodStatus('close', false)
    console.log('[WritableStream] close() finished')
  })
}

function updateMethodStatus(method: StreamMethod, isActive: boolean) {
  activeMethodStatus.value[method] = isActive
}

function triggerError() {
  streamController.value?.error('error from WritableStream')
  errorNotification.value = '[WritableStream] error'
}

defineExpose({
  writableStream
})
</script>

<template>
  <Item>
    <Card>
      <template #code>
        new WritableStream({
        <Statement :active="activeMethodStatus.start">
          start() {
          <ButtonReturn
            :disabled="!activeMethodStatus.start"
            @click="startPromise.resolve(undefined)"
          />
          },
        </Statement>

        <Statement :active="activeMethodStatus.write">
          write() {
          <ButtonReturn
            :disabled="!activeMethodStatus.write"
            @click="writeReturnPromise?.resolve(undefined)"
          />
          },
        </Statement>

        <Statement :active="activeMethodStatus.abort">
          abort() {
          <ButtonReturn
            :disabled="!activeMethodStatus.abort"
            @click="abortReturnedPromise?.resolve(undefined)"
          />
          },
        </Statement>

        <Statement :active="activeMethodStatus.close">
          close() {
          <ButtonReturn
            :disabled="!activeMethodStatus.close"
            @click="closeReturnedPromise?.resolve(undefined)"
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
            <label class="flex items-center gap-x-1">
              <input type="checkbox" v-model="autoReturn" />
              auto return form write()
            </label>
          </div>
          <div class="flex items-center gap-x-2">
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
