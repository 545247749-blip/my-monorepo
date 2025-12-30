<template>
  <div class="md-item">
    <main>
      <div style="margin-bottom: 100px" v-html="renderedHtml"></div>

    </main>
  </div>
</template>

<script setup>
import { defineAsyncComponent, ref, h, computed } from 'vue'
import { useDynamicMarkdown } from '@/views/useMarkdown.js'
import document from './document.md?raw'

const { renderedHtml } = useDynamicMarkdown(document, {
  code: 'aaaaaaaaaaaaaaaaaaaa',
})
</script>

<style scoped lang="scss">

</style>
