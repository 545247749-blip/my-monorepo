import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@/style/css/reset.scss'
import '@/style/css/markdown.scss'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

//
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
app.use(ElementPlus)

import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
app.use(Antd)

import 'prismjs/themes/prism-tomorrow.css'

// import 'github-markdown-css/github-markdown.css' // 亮色主题
// import 'github-markdown-css/github-markdown-dark.css'   // 深色主题
import 'github-markdown-css/github-markdown-light.css' // 浅色主题

app.mount('#app')
