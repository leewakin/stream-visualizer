export const strategy = {
  highWaterMark: 10,
  size(chunk: string) {
    return parseInt(chunk)
  }
}

export function createLogoStream() {
  return new TransformStream({
    transform(chunk, controller) {
      ;(async function () {
        // 动画
        await new Promise(r => setTimeout(r, 1000))

        console.log('🚀 ~ file: utils.ts ~ line 13 ~ chunk', chunk)

        controller.enqueue(chunk)
      })()
    }
  })
}
