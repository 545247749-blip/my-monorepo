<template>
  <div class="md-item">
    <component :is="document" />
  </div>
</template>

<script setup>
import { defineAsyncComponent } from 'vue'
const document = defineAsyncComponent(() => import('./document.md'))
</script>

<style scoped lang="scss">
.container {

}
</style>
