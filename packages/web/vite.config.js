import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import Markdown from 'vite-plugin-md'
import anchor from 'markdown-it-anchor'
import Prism from 'markdown-it-prism'
import container from 'markdown-it-container'

// https://vitejs.dev/config/
export default defineConfig({
  // base: '/cx-colorComputing',
  plugins: [
    vue({
      include: [/\.vue$/, /\.md$/], // 允许处理 .md 文件
    }),
    Markdown({
      markdownItOptions: {
        html: true,
        linkify: true,
        typographer: true,
      },
      markdownItSetup (md) {
        md.use(anchor)
        md.use(Prism)
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  devServer: {
    // 注意：这里不配置 proxy，所有请求都走 Express 代理服务器
    proxy: false,
  },
  server: {
    host: '127.0.0.1',
    port: '5000',
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
