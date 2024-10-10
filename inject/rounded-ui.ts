import { proxy } from './utils/proxy'

const contextMenuClass = 'context-view'
const contextMenuCss = `.${contextMenuClass} { border-radius: var(--radius); overflow: hidden; }`

const styleEditorContextMenu = (shadowRoot: ShadowRoot) => {
  const sheet = new CSSStyleSheet()
  sheet.replaceSync(contextMenuCss)
  shadowRoot.adoptedStyleSheets = [sheet]
}

proxy(Element.prototype, 'attachShadow', (shadowRoot: ShadowRoot) => {
  proxy(shadowRoot, 'appendChild', (child: HTMLElement) => {
    if (child.classList.contains(contextMenuClass)) styleEditorContextMenu(shadowRoot)
  })
})
