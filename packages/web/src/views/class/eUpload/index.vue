<template>
  <div style="border: 10px solid blue; display: flex">
    <input class="file-input" type="file" />

    <button @click="upload">点击上传</button>

  </div>
</template>

<script setup>
import { uploadFile } from '@my-monorepo/apps'

function upload () {
  let el = document.querySelector('.file-input')
  let formData = new FormData()
  let file = el.files[0]
  if (!file) {
    alert('不存在文件')
    return
  }
  formData.append('file', file)
  uploadFile(formData).then(res => {
    console.log(`上传成功：`, res)
  })
}

function getDate () {
  let value = '2026-3-29 2:30:30'
  value = '2026-10-25 2:30:30'
  let timeZone = 'Europe/Paris'
  let timeZoneShort = 'GMT+01:00'

  let formate = dateTimeFormat(timeZone, value, timeZoneShort)
  console.log(formate)

  let isSumme = isSummer(formate)

  let isSummerStart = isSummerHourStart(formate, value)

  let isSummerEnd = isSummerHourEnd(timeZone, value, timeZoneShort)
}
getDate()

function dateTimeFormat (timeZone, value, timeZoneShort) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    dateStyle: 'full',
    timeStyle: 'full',
    hour12: false,
  })
  let date = new Date(value + ' ' + timeZoneShort)
  return formatter.formatToParts(date).reduce((res, item) => {
    res[item.type] = item.value
    return res
  }, {})
}

function isSummer (formate) {
  let timeZoneName = formate.timeZoneName || ''
  return timeZoneName.includes('Summer') || formate.timeZoneName.includes('Daylight')
}

function isSummerHourStart (formate, value) {
  value = new Date(value)
  let formateH = formate.hour || ''
  let h = value.getHours()
  console.log('是否冬令时无时间:', Number(formateH) !== h)
  console.log('传入时：', h)
  console.log('计算后时：', Number(formateH))
  return Number(formateH) !== h
}

function isSummerHourEnd (timeZone, value, timeZoneShort) {
  let h = timeZoneShort.replace('GMT', '').split(':')
  let h1 = +h[0]
  let GMTs = [h1 - 1, h1, h1 + 1].map(it => `GMT+${it}:${h[1]}`)
  GMTs = GMTs.reduce((res, item) => {
    let formate = dateTimeFormat(timeZone, value, item)
    let formateH = formate.hour || ''
    res.add(formateH)
    return res
  }, new Set())
  console.log('是否夏令时重复时间: ', GMTs.size < 3)
  console.log(GMTs)
  return GMTs.size < 3
}
</script>

<style scoped lang="less">

</style>
