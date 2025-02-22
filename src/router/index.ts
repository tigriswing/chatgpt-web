import type { App } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHashHistory } from 'vue-router'
import { setupPageGuard } from './permission'
import { ChatLayout } from '@/views/chat/layout'
import registerComponent from '@/views/account/register.vue'
import loginComponent from '@/views/account/login.vue'
import resetpwdComponent from '@/views/account/resetpwd.vue'
// import widgetsPageComponent from '@/views/widgets/index.vue'
import interViewPageComponent from '@/views/interview/index.vue'
import userProtocol from '@/views/account/userprotocol.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Root',
    component: ChatLayout,
    redirect: '/chat',
    children: [
      {
        path: '/chat/:uuid?',
        name: 'Chat',
        component: () => import('@/views/chat/index.vue'),
      },
    ],
  },

  {
    path: '/register',
    name: 'register',
    component: registerComponent,
    beforeEnter(to, from, next) {
      // 如何已经登陆，则直接跳转到首页；TODO
      next()
    },
  },

  {
    path: '/resetpwd',
    name: 'resetpwd',
    component: resetpwdComponent,
    beforeEnter(to, from, next) {
      // 如何已经登陆，则直接跳转到首页；TODO
      next()
    },
  },

  {
    path: '/login',
    name: 'login',
    component: loginComponent,
    beforeEnter(to, from, next) {
      // 如何已经登陆，则直接跳转到首页；TODO
      next()
    },
  },

  // {
  //   path: '/widgets',
  //   name: 'widgets',
  //   component: widgetsPageComponent,
  // },

  {
    path: '/talk',
    name: 'talk',
    component: interViewPageComponent,
  },

  {
    path: '/protocol',
    name: 'protocol',
    component: userProtocol,
  },

  {
    path: '/404',
    name: '404',
    component: () => import('@/views/exception/404/index.vue'),
  },

  {
    path: '/500',
    name: '500',
    component: () => import('@/views/exception/500/index.vue'),
  },

  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    redirect: '/404',
  },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

setupPageGuard(router)

export async function setupRouter(app: App) {
  app.use(router)
  await router.isReady()
}
