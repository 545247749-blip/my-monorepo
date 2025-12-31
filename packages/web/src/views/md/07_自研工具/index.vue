<template>
  <div class="md-item">
    <main>
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<style scoped lang="scss">

</style>
