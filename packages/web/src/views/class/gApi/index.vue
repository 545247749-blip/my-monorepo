<template>
  <div>
    <el-button @click="api">请求1</el-button>
    <el-button @click="api2">请求2</el-button>
  </div>
</template>

<script setup>
import { requestor } from '@my-monorepo/apps'

function api () {
  requestor('/health').then(res => {
    console.log(res)
  })
}

function api2 () {
  requestor('/health').then(res => {
    console.log(res, '222')
  })
}
</script>

<style scoped lang="less">

</style>
