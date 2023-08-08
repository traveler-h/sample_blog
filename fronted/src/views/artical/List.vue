<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <h3>文章列表</h3>
        <el-button size="default" type="primary" @click="toArticalEdit(-1)">新增文章</el-button>
      </div>
    </template>
    <el-table :data="articalList" highlight-current-row border height="550" style="width: 100%">
      <el-table-column align="center" prop="title" label="文章标题" width="100" />
      <el-table-column align="center" prop="category" label="文章分类" width="100">
        <template #default="scope">
          <el-tag disable-transitions>{{ scope.row.category }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="author" label="文章作者" width="80" />
      <el-table-column align="center" prop="subTitle" label="文章副标题" width="120" />
      <el-table-column align="center" prop="introduction" label="文章简介" width="180" />
      <el-table-column align="center" prop="createDate" label="创建时间" width="220" />
      <el-table-column align="center" prop="updateDate" label="更新时间" width="220" />
      <el-table-column align="center" label="操作" fixed="right" width="200">
        <template #default="scope">
          <el-button size="small" type="primary" @click="toArticalEdit(scope.row.articalId)">编辑</el-button>
          <el-button size="small" type="danger" @click="toDeleteArtical(scope.row.articalId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange"
      layout="total, sizes, prev, pager, next" :current-page="pageForm.pageNum" :page-sizes="[10, 20, 50, 100]"
      :page-size="pageForm.pageSize" background :total="pageForm.total" />
  </el-card>
</template>
  
<script setup lang='ts'>
import { Pagination } from '@/interfaces/pagination'
import { ArticalItem } from '@/interfaces/artical'
import { useRouter } from 'vue-router';
import { getArticalList, deleteArticalById } from '@/api/artical'
import { onMounted, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
const router = useRouter()
let articalList: ArticalItem[] = reactive([])

const pageForm: Pagination = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0
})

const getList = () => {
  getArticalList({
    pageNum: pageForm.pageNum,
    pageSize: pageForm.pageSize
  }).then(result => {
    if (result.code === 200) {
      articalList = result.data
      pageForm.total = result?.pages.total
    } else {
      ElMessage.error(result.msg)
    }
  })

}

onMounted(() => {
  getList()
})

const handleSizeChange = (val: number) => {
  console.log(val)
  pageForm.pageSize = val
  getList()
}
const handleCurrentChange = (val: number) => {
  pageForm.pageNum = val
  getList()
}
const toArticalEdit = (val: number | undefined) => {
  router.push({
    path: '/artical/edit',
    query: {
      id: val
    }
  })
}

const toDeleteArtical = (val: number) => {
  ElMessageBox.confirm('确定删除吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    deleteArticalById(val).then(result => {
      if (result.code === 200) {
        ElMessage({
          type: 'success',
          message: '删除成功',
        })
        getList()
      } else {
        ElMessage({
          type: 'error',
          message: '删除失败',
        })
      }
    })

  }).catch(() => {
    ElMessage({
      type: 'info',
      message: '取消操作',
    })
  })
}
</script>
  
<style lang="scss" scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination {
  margin-top: 30px;
  justify-content: center;
}
</style>