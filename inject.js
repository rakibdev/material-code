const contextMenuClass = 'context-view'
const contextMenuCss = `.${contextMenuClass} { border-radius: var(--radius); overflow: hidden; }`

const styleEditorContextMenu = shadowRoot => {
  const sheet = new CSSStyleSheet()
  sheet.replaceSync(contextMenuCss)
  shadowRoot.adoptedStyleSheets = [sheet]
}

const proxy = (source, method, callback) => {
  const original = source[method]
  source[method] = function (...args) {
    const returned = original.call(this, ...args)
    callback.call(this, returned)
    return returned
  }
}

proxy(Element.prototype, 'attachShadow', shadowRoot => {
  proxy(shadowRoot, 'appendChild', child => {
    if (child.classList.contains(contextMenuClass)) styleEditorContextMenu(shadowRoot)
  })
})

const addListeners = (element, events, func, options = {}) => {
  events.split(' ').forEach(event => {
    element.addEventListener(event, func, options[event])
  })
}

const removeListeners = (element, events, func) => {
  events.split(' ').forEach(event => {
    element.removeEventListener(event, func)
  })
}

const showRipple = (element, event) => {
  const rect = element.getBoundingClientRect()
  const x = event.clientX ? event.clientX - rect.left : rect.width / 2
  const y = event.clientY ? event.clientY - rect.top : rect.height / 2
  const corners = [
    { x: 0, y: 0 },
    { x: rect.width, y: 0 },
    { x: 0, y: rect.height },
    { x: rect.width, y: rect.height }
  ]
  let radius = 0
  corners.forEach(corner => {
    const x_delta = x - corner.x
    const y_delta = y - corner.y
    const corner_distance = Math.sqrt(x_delta * x_delta + y_delta * y_delta)
    if (corner_distance > radius) {
      radius = corner_distance
    }
  })
  // ripple soft edge size 65% of container.
  radius += radius * (65 / 100)
  const ripple = document.createElement('div')
  ripple.className = 'ripple'
  ripple.style.width = radius * 2 + 'px'
  ripple.style.height = ripple.style.width
  ripple.style.left = x - radius + 'px'
  ripple.style.top = y - radius + 'px'

  const container = document.createElement('div')
  container.className = 'ripple-container'
  container.appendChild(ripple)
  element.appendChild(container)

  const ripple_animation = ripple.animate({ transform: ['scale(0.1)', 'scale(1)'] }, 400)
  const hideRipple = async () => {
    removeListeners(element, 'pointerup pointerleave', hideRipple)
    await ripple_animation.finished
    const hide_animation = ripple.animate(
      { opacity: [getComputedStyle(ripple).opacity, 0] },
      { duration: 100, fill: 'forwards' }
    )
    await hide_animation.finished
    ripple.remove()
    container.remove()
  }
  addListeners(element, 'pointerup pointerleave', hideRipple)
}

const findParent = (element, selector) => {
  const max_depth = 5
  let count = 0
  while (element) {
    if (element.matches(selector)) return element
    element = element.parentElement
    if (++count > max_depth) return
  }
}

document.body.addEventListener('pointerdown', event => {
  const rippleElement = findParent(
    event.target,
    '[role=button], [role=tab], [role=listitem], [role=treeitem], [role=menuitem], [role=option], .scrollbar > .slider'
  )
  if (rippleElement) {
    if (getComputedStyle(rippleElement).position == 'static') rippleElement.style.position = 'relative'
    showRipple(rippleElement, event)
  }
})
