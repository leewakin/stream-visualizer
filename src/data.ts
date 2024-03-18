import { inject, ref, InjectionKey } from 'vue'

export const logSymbol: InjectionKey<ReturnType<typeof initLog>> = Symbol('log')

export function initLog() {
  return ref<string[]>([])
}

export function useLog() {
  const logs = inject(logSymbol)!

  function push(..._logs: string[]) {
    // 09:25:02.510 >
    const prefix = new Date().toLocaleTimeString()
    const log = `${prefix} > ${_logs.join(' ')}`
    logs.value.push(log)
  }

  function pop() {
    return logs.value.pop()
  }

  function clear() {
    logs.value.length = 0
  }

  return {
    logs,
    push,
    pop,
    clear
  }
}
