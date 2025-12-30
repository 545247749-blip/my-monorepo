<template>
  <div class="app">
    <RouterView />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<style scoped lang="less">
.app{
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>
