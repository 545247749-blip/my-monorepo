<template>
  <div class="download">
    <el-button @click="fileDown">点击下载</el-button>
  </div>
</template>

<script setup>
import { Download } from './download'

function fileDown () {
  // Download.xhr({
  //   url: '/public/wechat.exe',
  //   method: 'POST',
  // })

  Download.link('/public/wechat.exe')
}
</script>

<style scoped lang="scss">
.download{

}
</style>
