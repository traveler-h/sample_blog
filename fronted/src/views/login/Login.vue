<template>
  <div class="login-container">
    <el-form :model="loginForm" ref="loginFormRef" :rules="rules" class="login-form" size="mini" label-position="left"
      label-width="120px">
      <el-form-item label="用户名" prop="userName">
        <el-input :prefix-icon="Avatar" v-model="loginForm.userName" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="userPassword">
        <el-input type="password" :prefix-icon="Lock" v-model="loginForm.userPassword" placeholder="请输入密码"
          show-password></el-input>
      </el-form-item>
      <el-form-item label-width="0px" class="operation-btn">
        <el-button type="primary" @click="userRegister(loginFormRef)">注册</el-button>
        <el-button type="primary" @click="userLogin(loginFormRef)">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { Avatar, Lock } from '@element-plus/icons-vue'
import { regist, login } from '@/api/user'
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { useRouter } from 'vue-router';
interface LoginForm {
  userName: string,
  userPassword: string
}
const loginForm = reactive<LoginForm>({
  userName: 'admin',
  userPassword: '123456'
})
const rules = reactive<FormRules<LoginForm>>({
  userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  userPassword: [{ required: true, message: '请输入密码', trigger: 'blur' }]
})
const router = useRouter()
const loginFormRef = ref<FormInstance>()

const userLogin = async (fromRule: FormInstance | undefined) => {
  if (!fromRule) {
    return
  }
  await fromRule.validate(async (valid, fields) => {
    if (valid) {
      const result = await login(loginForm)
      const { code, data, msg } = result
      if (code !== 200) {
        ElMessage.error(msg);
        return
      } else {
        router.push('/dashboard')
      }
    }
  })
}
const userRegister = async (fromRule: FormInstance | undefined) => {
  if (!fromRule) {
    return
  }
  await fromRule.validate(async (valid, fields) => {
    if (valid) {
      const result = await regist(loginForm)
      const { code, data, msg } = result
      if (code !== 200) {
        ElMessage.error(msg);
        return
      } else {
        userLogin(fromRule)
      }
    }
  })
}
</script>

<style lang="scss" scopeds>
@import '@/assets/style/minx.scss';

.login-container {
  width: 100%;
  height: 100%;
  @include flex-middle;

  .login-form {
    width: 600px;
  }

}
</style>