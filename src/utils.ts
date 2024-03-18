export const strategy = {
  highWaterMark: 10,
  size(chunk: string) {
    return parseInt(chunk)
  }
}

export function createAnimationStream(form: HTMLElement, to: HTMLElement) {
  return new TransformStream({
    transform(chunk, controller) {
      ;(async function () {
        const formRect = form.getBoundingClientRect()
        const toRect = to.getBoundingClientRect()
        const chunkEl = document.createElement('div')
        chunkEl.classList.add('chunk')
        chunkEl.textContent = chunk
        const animation = chunkEl.animate(
          generateKeyframes(formRect.x, formRect.y, toRect.x, toRect.y),
          {
            duration: 1000
          }
        )

        document.body.appendChild(chunkEl)
        await waitAnimationEnd(animation)
        chunkEl.remove()

        controller.enqueue(chunk)
      })()
    }
  })
}

function waitAnimationEnd(animation: Animation) {
  return new Promise(resolve => {
    animation.onfinish = resolve
  })
}

function generateKeyframes(
  formX: number,
  formY: number,
  toX: number,
  toY: number
) {
  return [
    {
      offset: 0,
      opacity: 0,
      transform: `translate(${formX}px, ${formY}px)`
    },
    {
      offset: 0.15,
      opacity: 1
    },
    {
      offset: 0.85,
      opacity: 1
    },
    {
      offset: 1,
      opacity: 0,
      transform: `translate(${toX}px, ${toY}px)`
    }
  ]
}
