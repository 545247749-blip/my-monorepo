<template>
  <div class="defineProperty">

    <dl>
      <dt>aa：</dt>
      <dt class="data-aa">{{ data.aa }}</dt>
    </dl>

    <dl>
      <dt>bb：</dt>
      <dt class="data-bb">{{ data.bb }}</dt>
    </dl>


    <dl>
      <dt>cc：</dt>
      <dt class="data-cc">{{ data.cc }}</dt>
    </dl>

    <div>
      <label>aa</label>
      <input @input="data.aa=$event.target.value" />
    </div>


    <div>
      <label>bb</label>
      <input @input="data.bb=$event.target.value"  />
    </div>

  </div>
</template>

<script setup>
import { observe, autoRun } from './defineProperty'
import { onMounted } from 'vue'

let data = {
  aa: '11',
  bb: '22',
  cc: '1122',
}
observe(data)

function changeVal () {
  let el = document.querySelector('.data-aa')
  el.textContent = data.aa
}

function changeVal2 () {
  let el = document.querySelector('.data-bb')
  el.textContent = data.bb
}

function changeVal3 () {
  let el = document.querySelector('.data-cc')
  el.textContent = data.aa + data.bb
}


onMounted(() => {
  autoRun(changeVal)
  autoRun(changeVal2)
  autoRun(changeVal3)
})
</script>

<style scoped lang="scss">
.defineProperty{
  dl{
    display: flex;
  }
  > div{
    margin-top: 10px;
  }
}
</style>
