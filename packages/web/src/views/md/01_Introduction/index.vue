<template>
  <div class="md-item">
    <main>
      <component :is="document" />
    </main>
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
