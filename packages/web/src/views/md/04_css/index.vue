<template>
  <div class="md-item">
    <main v-html="renderedHtml">
    </main>
  </div>
</template>

<script setup>
import document from './document.md?raw'
import { useDynamicMarkdown } from '@/views/useMarkdown.js'

const { renderedHtml } = useDynamicMarkdown(document, {

})
</script>

<style scoped lang="scss">
.aa{
  position: absolute;
  float: left; // right both
  overflow: hidden;
  display: inline-block;
}
</style>
