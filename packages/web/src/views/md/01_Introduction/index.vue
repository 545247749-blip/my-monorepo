<template>
  <div class="container">
    <div class="main">
      <div class="main-1"></div>
    </div>
  </div>
</template>

<script setup>

</script>

<style scoped lang="scss">
.container {
  border: 1px solid black;
  .main{
    background-color: red;
    height: 300px;
    margin-top: 100px;
    .main-1{
      background-color: blue;
      height: 100px;
      margin-top: 50px;
      width: 50%;
    }
  }
}
</style>
