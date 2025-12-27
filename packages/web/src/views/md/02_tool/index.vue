<template>
  <div class="md-item">
    <div class="markdown-body">
      <RouterView />
    </div>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<style scoped lang="scss">

</style>
