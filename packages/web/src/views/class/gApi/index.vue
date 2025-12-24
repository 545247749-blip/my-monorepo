<template>
  <div>
    <el-button @click="api">get请求1</el-button>
    <el-button @click="api2">get请求2</el-button>

    <hr />

    <el-button @click="postapi">post请求1</el-button>
    <el-button @click="postapi2">post请求2</el-button>

    <hr />

    <el-button @click="formapi">fordata请求1</el-button>
    <el-button @click="formapi2">fordata请求2</el-button>

    <hr />

    <el-button @click="coreapi">core请求1</el-button>
    <el-button @click="coreapi2">core请求2</el-button>

    <hr />
    
  </div>
</template>

<script setup>
import { requestor, postRequestor, postRequestor2 } from '@my-monorepo/apps'

function api () {
  let d = Date.now()
  requestor('/health').then(({ data }) => {
    console.log('请求返回:', d, data)
  }).catch(err => {
    console.error('请求错误:', err)
  })
}

function api2 () {
  requestor('/health').then(res => {
    console.log(res, '222')
  })
}

function postapi () {
  postRequestor('/postBack', {
    postData: 'nihao ',
  }).then(res => {
    console.log(res)
  })
}

function postapi2 () {
  postRequestor('/postBack').then(res => {
    console.log(res, '222')
  })
}

function formapi () {
  let form = new FormData()
  form.append('fileMy', 'zheshi wenjian ')
  postRequestor('/postBack', form).then(res => {
    console.log(res)
  })
}

function formapi2 () {
  postRequestor('/postBack').then(res => {
    console.log(res, '222')
  })
}


function coreapi () {
  let form = new FormData()
  form.append('fileMy2', 'zheshi wenjian2 ')
  postRequestor2('/postBack', form).then(res => {
    console.log(res)
  })
}

function coreapi2 () {
  postRequestor2('/postBack', {
    fileMy2: 'zheshi wenjian2 ',
  }).then(res => {
    console.log(res, '222')
  })
}
</script>

<style scoped lang="less">

</style>
