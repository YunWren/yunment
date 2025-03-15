import DefaultTheme from "vitepress/theme";
import '@vitepress-demo-preview/component/dist/style.css'
import '../../../src/styles/index.css'
import '../../../src/styles/index.css'
import { watch } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import './style/index.css'
let homePageStyle: HTMLStyleElement | undefined
import { ElementPlusContainer } from '@vitepress-demo-preview/component'
library.add(fas)

export default {
  ...DefaultTheme,
  enhanceApp({ app, router }) {
    app.component('demo-preview', ElementPlusContainer)
    // 彩虹背景动画样式
    if (typeof window !== 'undefined') {
      watch(
        () => router.route.data.relativePath,
        () => updateHomePageStyle(location.pathname === '/'),
        { immediate: true },
      )
    }

  },
}
function updateHomePageStyle(value: boolean) {
  if (value) {
    if (homePageStyle) return

    homePageStyle = document.createElement('style')
    homePageStyle.innerHTML = `
    :root {
      animation: rainbow 12s linear infinite;
    }`
    document.body.appendChild(homePageStyle)
  } else {
    if (!homePageStyle) return

    homePageStyle.remove()
    homePageStyle = undefined
  }
}