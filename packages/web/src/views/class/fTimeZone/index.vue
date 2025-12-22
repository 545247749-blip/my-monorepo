<template>
  <div>

    <ul style="min-height: 200px; border: 1px solid red">
      <li v-for="(value, key) in dataMy" :key="key">
        <span>{{ key }}: </span>
        <span>{{ value }}</span>
      </li>
    </ul>

    <el-date-picker v-model="date" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import ClassTimeZone from './TimeZoneClass'

let date = ref('')
let dataMy = ref('111')
watch(() => date.value, (val) => {
  //  console.log(val.toLocaleString())
  console.log(val, 'valll')
  let data = ClassTimeZone.getDate('Europe/Paris', val)
  dataMy.value = data
  setTimeout(() => {
    date.value = data.output.value
    console.log(data.output)
  })
})
</script>

<style scoped lang="less">

</style>
