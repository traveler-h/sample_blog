<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <h3>分类列表</h3>
        <el-button size="default" type="primary" @click="toCategoryEdit(-1)">新增分类</el-button>
      </div>
    </template>
    <el-table :data="state.categoryList" highlight-current-row border height="550" style="width: 100%">
      <el-table-column align="center" prop="categoryName" label="分类名称" />
      <el-table-column align="center" prop="categoryDesc" label="分类描述" />
      <el-table-column align="center" label="操作" fixed="right" width="200">
        <template #default="scope">
          <el-button size="small" type="primary" @click="toCategoryEdit(scope.row.categoryId)">编辑</el-button>
          <el-button size="small" type="danger" @click="toCategoryDelete(scope.row.categoryId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="dialogVisible" title="编辑分类">
      <el-form :model="categoryForm">
        <el-form-item label="分类名称" label-width="120px">
          <el-input v-model="categoryForm.categoryName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="分类描述" label-width="120px">
          <el-input type="textarea" v-model="categoryForm.categoryDesc" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">
            保存
          </el-button>
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>
  
<script setup lang='ts'>
import { CategoryItem } from '@/interfaces/artical'
import { getAllCategoryList, deleteCategory, createCategory, getCategoryById } from '@/api/category'
import { nextTick, onMounted, reactive, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { updateCategory } from '@/api/category';
let state = reactive({
  categoryList: []
})
let dialogVisible = ref(false)
let categoryForm: CategoryItem = reactive({
  categoryId: -1,
  categoryDesc: '',
  categoryName: ''
})
const getCategoryList = async () => {
  const result = await getAllCategoryList()
  if (result.code === 200) {
    nextTick(() => {
      state.categoryList = result.data
    })
    
  } else {
    ElMessage.error(result.msg)
  }

}

onMounted(() => {
  getCategoryList()
})

const toCategoryEdit = (val: number | undefined) => {
  dialogVisible.value = true
  if (val !== -1) {
    getCategoryById(val).then(res => {
      if (res.code === 200) {
        categoryForm.categoryId = val
        categoryForm.categoryName = res.data[0].categoryName
        categoryForm.categoryDesc = res.data[0].categoryDesc
      }
    })
  } else {
    categoryForm.categoryId = -1
    categoryForm.categoryName = ''
    categoryForm.categoryDesc = ''
  }
}

const toCategoryDelete = (val: number) => {
  ElMessageBox.confirm('确定删除吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    deleteCategory(val).then(result => {
      if (result.code === 200) {
        ElMessage({
          type: 'success',
          message: '删除成功',
        })
        getCategoryList()
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

const handleSubmit = () => {
  let fun = categoryForm.categoryId === -1 ? createCategory : updateCategory
  let message = categoryForm.categoryId === -1 ? '新增成功' : '修改成功'
  fun(categoryForm).then(result => {
    if (result.code == 200) {
      ElMessage.success(message)
      dialogVisible.value = false
      getCategoryList()
    } else {
      ElMessage.error('操作失败')
    }
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