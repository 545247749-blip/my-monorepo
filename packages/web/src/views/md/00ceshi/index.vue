<template>
  <div class="md-item">
    <main>
      <component :is="content" />
    </main>
  </div>
</template>

<script setup>
import { defineAsyncComponent } from 'vue'

const content = defineAsyncComponent(() => import(`./ceshi.md`))
</script>

<style scoped lang="scss">

</style>
