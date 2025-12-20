<template>
  <div class="watch-element">
    {{ formatDate2(new Date()) }}
    <div ref="scrollDiv" class="scroll-out">
      <div class="scroll-main">
        <div v-for="(value, key) in react" :key="key">
          {{ key }}: {{ value }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, reactive, watch, shallowRef } from 'vue'
import { WatchElement } from './watchElement.js'
import { formatDate2 } from '@my-monorepo/apps'

let react = shallowRef({ })
let scrollDiv = ref()
let watcher

onMounted(() => {
  if (scrollDiv.value && !watcher) {
    watcher = new WatchElement(scrollDiv.value, (currentRect, previousRect) => {
      react.value = currentRect
    })
  }
})

onBeforeUnmount(() => {
  watcher && watcher.destroy()
  watcher = undefined
})
</script>

<style scoped lang="less">
.watch-element{
  width: 100%;
  height: 100%;
  border: 1px solid red;
  overflow: auto;
  .scroll-out{
    width: 70%;
    border: 2px solid black;
    height: 200%;
    background: linear-gradient(180deg,
    #9ab0ff 0%,
    #fad0c4 50%,
    #4dff01 100%
    );
    .scroll-main{
      position: sticky;
      top: 100px;
      display: flex;
      flex-direction: column;
    }
  }
}
</style>
