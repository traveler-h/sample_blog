import { createApp } from 'vue'
import '@/assets/style/index.scss'
import App from './App.vue'
import pinia from '@/store'
import router from '@/router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)
app.use(pinia)
Object.keys(ElementPlusIconsVue).forEach(key => { 
  app.component(key, ElementPlusIconsVue[key as keyof typeof ElementPlusIconsVue]); 
});
app.use(pinia)
app.use(router)
app.mount('#app')


