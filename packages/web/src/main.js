import { createApp } from 'vue'
import { createPinia } from 'pinia'

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

app.mount('#app')
