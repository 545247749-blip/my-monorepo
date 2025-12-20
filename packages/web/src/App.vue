<template>
  <div class="app">
    <!--    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
    <div>
      <span @click="routeClick">111</span>
      <span @click="routeClick2">22</span>
    </div> -->



    <RouterView />
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { reactive, ref } from 'vue'
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

<style lang="less">
*{
  margin: 0;
  padding: 0;
  list-style-type: none;
  box-sizing: border-box;
}
</style>
