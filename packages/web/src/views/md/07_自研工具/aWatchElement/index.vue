<template>
  <div class="watch-element">
    <header>
      <div ref="scrollDiv" class="scroll-out">
        <div class="scroll-main">
          <div v-for="(value, key) in react" :key="key">
            {{ key }}: {{ value }}
          </div>
        </div>
      </div>

      <div class="btn-right">

        <div ref="btns" class="btns">
          <el-button>按钮</el-button>
          <div class="popover" :style="{ top: react.top + 30 + 'px', left: react.left + 'px' }">
            dewdewdewd
          </div>
        </div>

      </div>
    </header>

    <section v-html="renderedHtml"></section>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, reactive, watch, shallowRef, defineAsyncComponent } from 'vue'
import { WatchElement } from './watchElement.js'
import WatchElementRaw from './watchElement.js?raw'
import { useDynamicMarkdown } from '@/views/useMarkdown.js'
import document from './document.md?raw'

// 监听器
let watcher
let react = reactive({})
let scrollDiv = ref()
let btns = ref()
onMounted(() => {
  if (scrollDiv.value && !watcher) {
    watcher = new WatchElement(btns.value, (currentRect, previousRect) => {
      Object.assign(react, { ...currentRect })
    })
  }
})
onBeforeUnmount(() => {
  watcher && watcher.destroy()
  watcher = undefined
})

// 高亮方法
const { renderedHtml } = useDynamicMarkdown(document, {
  code: WatchElementRaw,
})
</script>

<style scoped lang="less">
.watch-element{
  width: 100%;
  header{
    height: 800px;
    border: 1px solid red;
    overflow: auto;
    display: flex;
    .btn-right{
      .btns{
        margin-top: 40px;
        position: relative;
        .popover{
          width: 100px;
          height: 800px;
          background-color: red;
          position: fixed;
          z-index: 10;
        }
      }
    }
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
}
</style>
