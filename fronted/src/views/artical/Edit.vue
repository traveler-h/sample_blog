<template>
  <el-card class="box-card">
    <el-form class="artical-form" :model="articalForm" ref="articalFrom" :rules="ruleForm" label-width="120px"
      label-position="left">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="articalForm.title" placeholder="文章标题"></el-input>
      </el-form-item>
      <el-form-item label="文章副标题" prop="subTitle">
        <el-input v-model="articalForm.subTitle" placeholder="文章副标题"></el-input>
      </el-form-item>
      <el-form-item label="文章介绍" prop="introduction">
        <el-input v-model="articalForm.introduction" placeholder="文章介绍"></el-input>
      </el-form-item>
      <el-form-item label="文章分类" prop="categoryId">
        <el-select v-model="articalForm.categoryId">
          <el-option v-for="item in data.categoryList" :key="item.categoryId" :label="item.categoryName" :value="item.categoryId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="content">
        <div style="border: 1px solid #ccc">
          <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig"
            mode="default" />
          <Editor style="height: 300px; overflow-y: hidden;" v-model="editorValue" :defaultConfig="editorConfig"
            mode="default" @onCreated="handleCreated" />
        </div>
      </el-form-item>
    </el-form>
    <div class="operation-btn">
      <el-button type="primary" @click="saveArtical">确认</el-button>
      <el-button type="danger" @click="clearArtical">重置</el-button>
    </div>
  </el-card>
</template>
  
<script setup lang='ts'>
import { reactive, shallowRef, onBeforeUnmount, onMounted, ref, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, FormRules } from 'element-plus'
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { IEditorConfig, IToolbarConfig } from '@wangeditor/editor'
import useUserStore from '@/store/modules/user'
import { ArticalItem } from '@/interfaces/artical'
import { createArtical, getArtical, updateArtical } from '@/api/artical'
import { getAllCategoryList } from '@/api/category'
import { storeToRefs } from 'pinia'
const route = useRoute()
const router = useRouter()
console.log(storeToRefs(useUserStore()).userInfo)
const id: string = route.query.id as string
let articalForm = reactive<ArticalItem>({
  title: '',
  subTitle: '',
  introduction: '',
  content: '',
  author: '',
  authorId: 1,
  category: '',
  categoryId: 2,
  articalId: parseInt(id)
})

const ruleForm = reactive<FormRules<ArticalItem>>({
  title: [
    { required: true, message: '文章标题必填', trigger: 'blur' },
    { max: 20, message: '最大为10字符', trigger: 'blur' }
  ],
  subTitle: [
    { max: 20, message: '最大为20字符', trigger: 'blur' }
  ],
  introduction: [
    { max: 80, message: '最大为80字符', trigger: 'blur' }
  ],
  content: [
    { max: 5000, message: '最大为5000字符', trigger: 'blur' }
  ],
  categoryId: [
    { required: true, message: '请选择文章类型', trigger: 'blur' }
  ],
})
const data = reactive({
  categoryList: []
})
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()

const toolbarConfig: Partial<IToolbarConfig> = {}
const editorConfig: Partial<IEditorConfig> = {
  placeholder: '请输入内容...',
  readOnly: false,
  scroll: true,
  MENU_CONF: {
    uploadImage: {
      server: '/api/artical/upload-image',
      fieldName: 'image'
    }
  }
}

const getCategoryList = () => {
  getAllCategoryList().then(result => {
    if(result.code === 200) {
      data.categoryList = result.data
    }
  })
  
}

const handleCreated = (editor) => {
  editorRef.value = editor // 记录 editor 实例，重要！
}

let editorValue = ref('')
const saveArtical = async () => {
  articalForm.content = editorValue.value
  let fun: any, message: string
  if(parseInt(id) == -1) {
    fun = createArtical
    message = '新增成功'
  } else {
    fun = updateArtical
    message = '更新成功'
  } 
  const result = await fun(articalForm)
  if (result.code === 200) {
    ElMessage.success(message)
    router.push('/artical/list')
  } else {
    ElMessage.error(result.msg)
  }
}

const clearArtical = () => {
    articalForm.title = ''
    articalForm.subTitle = ''
    articalForm.introduction = ''
    articalForm.content = ''
    articalForm.author = ''
    articalForm.authorId = 1
    articalForm.category = ''
    articalForm.categoryId = 1
    articalForm.articalId = parseInt(id)
}
onMounted(() => {
  if (parseInt(id) !== -1) {
    getArtical({ id: parseInt(id) }).then(res => {
      console.log(res)
      const data = res.data[0]
      articalForm.title = data.title
      articalForm.subTitle = data.subTitle
      articalForm.introduction = data.introduction
      articalForm.content = data.content
      articalForm.author = data.author
      articalForm.authorId = data.authorId
      articalForm.category = data.category
      articalForm.categoryId = data.categoryId
      articalForm.articalId = data.articalId

      nextTick(() => {
        editorRef.value.setHtml(data.content)
      })
    })
  }

  getCategoryList()
}),
  // 组件销毁时，也及时销毁编辑器
  onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy()
  })
</script>
  
<style lang="scss" scoped>
.box-card {
  overflow-y: auto;
  width: 100%;
  height: 100%;
}

.artical-form {
  width: 900px;
  padding: 20px;
  height: 680px;
  box-sizing: border-box;
  overflow-y: auto;
}

.operation-btn {
  padding: 20px;
  box-sizing: border-box;
  border-top: 1px solid #ccc;
}
</style>