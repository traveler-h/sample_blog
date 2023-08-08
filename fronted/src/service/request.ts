import axios from 'axios';
import { errorCodeType } from './errorCode';
import { ElMessage } from 'element-plus';

// 创建axios实例

const service = axios.create({
  // 服务接口请求
  baseURL: '/api', //import.meta.env.VITE_APP_BASE_API,
  // 超时设置
  timeout: 10000,
  headers: { 'Content-Type': 'application/json;charset=utf-8' },
});

// 请求拦截
service.interceptors.request.use(
  (config): any => {
    const token = window.sessionStorage.getItem('token');
    if (token) {
      config.headers.token = token;
    }
    return config;
  },
  (error) => {
    console.log(error);
    Promise.reject(error);
  }
);
// 响应拦截器
service.interceptors.response.use(
  (res: any) => {
    // hideLoading()
    // 未设置状态码则默认成功状态
    const code = res.status || 200;
    // 获取错误信息
    const message = errorCodeType(code) || res.data['message'] || errorCodeType('default');
    if (code === 200 || res.data.code == '0') {
      return Promise.resolve(res.data);
    } else {
      ElMessage.error(message);
      return Promise.reject(res.data);
    }
  },
  (error) => {
    console.log('err' + error);
    // hideLoading()
    let { message } = error;
    if (message == 'Network Error') {
      message = '后端接口连接异常';
    } else if (message.includes('timeout')) {
      message = '系统接口请求超时';
    } else if (message.includes('Request failed with status code')) {
      message = '系统接口' + message.substr(message.length - 3) + '异常';
    }
    ElMessage.error(message);
    return Promise.reject(error);
  }
);
export default service;
