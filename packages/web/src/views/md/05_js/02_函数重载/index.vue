<template>
  <div class="md-item">
    <main v-html="renderedHtml">
    </main>
  </div>
</template>

<script setup>
import document from './document.md?raw'
import { fn } from './fn.js'
import fnraw from './fn.js?raw'
import { useDynamicMarkdown } from '@/views/useMarkdown.js'

// 高亮方法
const { renderedHtml } = useDynamicMarkdown(document, {
  code: fnraw,
})
</script>

<style scoped lang="scss">

</style>
