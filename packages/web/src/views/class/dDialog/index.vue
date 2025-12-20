<template>
  <div>
    <el-button @click="open">
      弹窗
    </el-button>

    <Dialog v-model="showDialog" />

  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
let showDialog = ref()
let show = ref()
import Dialog from './dialog.vue'

function open () {
  showDialog.value = true
}
</script>

<style scoped lang="less">

</style>
