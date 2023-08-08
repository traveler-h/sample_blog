import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Login',
    component: () => import('@/views/login/Login.vue'),
    // 注意这里要带上 文件后缀.vue 
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/layout/Layout.vue'),
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/views/dashbord/Dashbord.vue'),
        meta: {
          title: '工作台'
        }
      }
    ]
  },
  {
    path: '/artical',
    name: 'Artical',
    component: () => import('@/views/layout/Layout.vue'),
    redirect: () => ({ path: '/artical/list' }),
    meta: {
      title: '文章管理'
    },
    children: [
      {
        path: 'list',
        name: 'ArticalList',
        component: () => import('@/views/artical/List.vue'),
        meta: {
          title: '文章列表'
        },
      },
      {
        path: 'edit',
        name: 'ArticalEdit',
        component: () => import('@/views/artical/Edit.vue'),
        meta: {
          title: '编辑文章'
        },
      },
      {
        path: 'category',
        name: 'ArticalCategory',
        component: () => import('@/views/artical/Category.vue'),
        meta: {
          title: '文章分类'
        },
      }
    ]
  }
]
const router = createRouter({ history: createWebHistory(), routes, })
export default router
