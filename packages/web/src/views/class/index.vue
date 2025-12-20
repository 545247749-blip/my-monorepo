<template>
  <div class="class">

    <div class="routes-list">
      <div v-for="(item, index) of routes" :key="index" class="route-item"
           @click.stop="toPath(item)">
        <div class="name"
             :class="{'is-active': item.path === route.path}">
          {{ item.path }}
        </div>

        <div class="routes-list2">
          <div v-for="(item2, index2) of item.children || []" :key="index2" class="route-item"
               @click.stop="toPath(item2)">
            <div class="name">{{ item2.path }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="router-view">
      <RouterView />
    </div>
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { computed, reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'


const router = useRouter()
const route = useRoute()
const routes = computed(() => {
  return router.options.routes.find(item => item.name === 'class').children
})

function toPath (route) {
  router.push({
    name: route.name,
  })
}
</script>

<style scoped lang="scss">
.class{
  height: 100%;
  display: flex;
  .routes-list,
  .routes-list2{
    width: 300px;
    display: flex;
    flex-direction: column;
    overflow: auto;
    &:first-of-type{
      border-right: 1px solid red;
      padding-top: 5px;
    }
    &:not(:first-of-type){
      padding-left: 30px;
    }
    .route-item{
      .name{
        height: 36px;
        padding: 0 10px;
        display: flex;
        align-items: center;
        cursor: pointer;
        border-bottom: 1px solid rgba(102, 102, 102, 0.1);
        &.is-active.is-active{
          background-color: #ddd;
        }
        &:hover{
          background-color: rgb(244, 244, 244);
        }
      }
    }
  }
  .router-view{
    flex: 1;
  }
}
</style>
