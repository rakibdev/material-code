import { addListeners, findParent, removeListeners } from './utils/element'

type TriggerEvent = PointerEvent | FocusEvent | KeyboardEvent

const showRipple = (element: HTMLElement, event: TriggerEvent) => {
  const rect = element.getBoundingClientRect()
  const x = 'clientX' in event ? event.clientX - rect.left : rect.width / 2
  const y = 'clientY' in event ? event.clientY - rect.top : rect.height / 2
  const maxRadius = Math.hypot(Math.max(x, rect.width - x), Math.max(y, rect.height - y))

  const ripple = document.createElement('div')
  ripple.className = 'ripple'
  ripple.style.width = maxRadius * 2 + 'px'
  ripple.style.height = ripple.style.width
  ripple.style.left = x - maxRadius + 'px'
  ripple.style.top = y - maxRadius + 'px'

  const container = document.createElement('div')
  container.className = 'ripple-container'
  container.appendChild(ripple)
  element.appendChild(container)

  const animation = ripple.animate({ transform: ['scale(0.1)', 'scale(1)'] }, 190)

  const releaseEvents: Record<string, Array<keyof HTMLElementEventMap>> = {
    pointerdown: ['pointerup', 'pointerleave'],
    keydown: ['keyup'],
    focusin: ['blur']
  }

  const hideRipple = async () => {
    removeListeners(element, releaseEvents[event.type], hideRipple)

    await animation.finished
    const hidingAnimation = ripple.animate(
      { opacity: [getComputedStyle(ripple).opacity, '0'] },
      { duration: 100, fill: 'forwards' }
    )
    await hidingAnimation.finished
    ripple.remove()
    container.remove()
  }

  addListeners(element, releaseEvents[event.type], hideRipple)
}

document.body.addEventListener('pointerdown', (event: PointerEvent) => {
  const rippleElement = findParent(event.target as HTMLElement, element =>
    element.matches(
      '[role=button], [role=tab], [role=listitem], [role=treeitem], [role=menuitem], [role=option], .scrollbar > .slider'
    )
  )
  if (rippleElement) {
    if (getComputedStyle(rippleElement).position == 'static') rippleElement.style.position = 'relative'
    showRipple(rippleElement, event)
  }
})
