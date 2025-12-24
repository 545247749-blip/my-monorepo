<template>
  <div class="md-item">
    <component :is="content" />
  </div>
</template>

<script setup>
import { defineAsyncComponent } from 'vue'

const content = defineAsyncComponent(() => import(`./ceshi.md`))
</script>

<style scoped lang="less">

</style>
