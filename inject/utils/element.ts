export const addListeners = <Type extends keyof HTMLVideoElementEventMap>(
  element: HTMLElement | Window,
  types: Type[],
  handler: EventListener
) => {
  for (const type of types) {
    element.addEventListener(type, handler)
  }
}

export const removeListeners = <Type extends keyof HTMLElementEventMap>(
  element: HTMLElement,
  types: Type[],
  handler: EventListener
) => {
  for (const type of types) {
    element.removeEventListener(type, handler)
  }
}

export const findParent = (start: HTMLElement, match: (element: HTMLElement) => boolean, maxDepth = 4) => {
  let count = 0
  let end: HTMLElement = start
  while (end) {
    if (end == (window as any) || end == document.body) return
    if (match(end)) return end
    if (end.parentElement) end = end.parentElement
    else return
    if (++count > maxDepth) return
  }
}
