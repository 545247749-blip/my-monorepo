<template>
  <dialog v-if="model"
          ref="dialog"
          @click="dialogClick"
          @animationend="animationend">

    <div ref="dialog_content" class="dialog-content">
      <div class="dialog-header">
        {{ title }}
      </div>

      <slot></slot>

      <div class="dialog-actions">
        <el-button @click="animateBeforeClose">
          关闭弹窗
        </el-button>
      </div>
    </div>

  </dialog>
</template>

<script setup>
import { nextTick, ref, watch } from 'vue'
const model = defineModel()
let dialog = ref()
let dialog_content = ref()

const emit = defineEmits([
  'closed',
])

const props = defineProps({
  title: {
    type: String,
    default: '这是一个弹窗title',
  },
})

watch(() => model.value, (val) => {
  if (val) {
    nextTick(() => {
      dialog.value.classList.add('animate')
      dialog.value.showModal()
    })
  }
})

function dialogClick (e) {
  // 点击模态背景
  if (e.target === e.currentTarget) {
    animateBeforeClose()
  }
}

function animateBeforeClose () {
  dialog.value.classList.remove('animate')
  dialog.value.classList.add('animate-reverse')
  dialog.value.offsetWidth // 触发重排，确保动画重新开始
  dialog.value.classList.add('animate')
}

function animationend (e) {
  if (e.target.classList.contains('animate-reverse')) {
    dialog.value.classList.remove('animate-reverse')
    dialog.value.classList.remove('animate')
    dialog.value.close()
    model.value = false
    emit('closed')
  }
  else {
    dialog.value && dialog.value.classList.remove('animate')
  }
}
</script>

<style scoped lang="scss">
dialog {
  border: 1px solid #ccc;
  border-radius: 8px;
  width: 400px;
  max-width: 90vw;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin: auto;
  &.animate{
    animation-name: animate;
    &::backdrop{
      animation-name: animate2;
    }
  }
  &.animate,
  &.animate::backdrop{
    animation-duration: 200ms;
    animation-iteration-count: 1;  
    animation-fill-mode: both;
  }

  &.animate-reverse,
  &.animate-reverse::backdrop {
    animation-direction: alternate-reverse;
  }
  &::backdrop {
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(2px);
  }
  .dialog-content{
    padding: 20px;
    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 20px;
    }
  }
}

@keyframes animate {
  0% {
    transform: translateY(-30px);
    opacity: 0;
  }
  100%{
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes animate2 {
  0% {
    opacity: 0;
  }
  100%{
    opacity: 1;
  }
}
</style>
