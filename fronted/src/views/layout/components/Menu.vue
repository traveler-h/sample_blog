<template>
  <el-menu active-text-color="#ffd04b" background-color="#545c64" class="admin-menu" default-active="/dashboard"
    text-color="#fff" router>
    <el-menu-item index="" style="display: flex;justify-content: center;
    align-items: center;">
      <el-icon>
        <Orange />
      </el-icon>
    </el-menu-item>
    <el-menu-item index="/dashboard">
      <template #title>
        <el-icon>
          <location />
        </el-icon>
        <span>工作台</span>
      </template>
    </el-menu-item>
    <el-sub-menu index="/artical">
      <template #title>
        <el-icon>
          <Edit />
        </el-icon>
        文章管理
      </template>
      <el-menu-item index="/artical/list">
        <el-icon>
          <Tickets />
        </el-icon>
        文章列表
      </el-menu-item>
      <el-menu-item index="/artical/category">
        <el-icon>
          <PieChart />
        </el-icon>
        文章分类
      </el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script lang="ts" setup>
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>

<style lang="scss" scoped>
.admin-menu {
  width: 260px;
  height: 100%;
}
</style>