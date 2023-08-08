<template>
  <div class="layout">
    <Menu class="menu"></Menu>
    <div class="main-container">
      <el-breadcrumb :separator-icon="ArrowRight" class="main-breadcrube">
        <el-breadcrumb-item v-for="item in breadCrube" :key="item.path" :to="{ path: item.path }">{{ item.meta.title
        }}</el-breadcrumb-item>
      </el-breadcrumb>
      <router-view />
    </div>
  </div>
</template>
  
<script setup lang='ts'>
import { ArrowRight } from '@element-plus/icons-vue'
import Menu from './components/Menu.vue';
import { useRoute } from 'vue-router'
import { reactive, ref, watch } from 'vue';
const route = useRoute()
const breadCrube = ref([])
const getBreadCrubeData = () => {
  breadCrube.value = route.matched.filter(
    item => item.meta && item.meta.title
  )
}
watch(
  route,
  () => {
    getBreadCrubeData()
  },
  {
    immediate: true
  }
)
</script>
  
<style lang="scss" scoped>
.layout {
  width: 100%;
  height: 100%;
  display: flex;
  overflow: hidden;
  
  .menu {
    flex-shrink: 0;
  }

  .main-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    flex-shrink: 1;
    height: 100%;

    .main-breadcrube {
      padding: 20px;
    }
  }
}
</style>