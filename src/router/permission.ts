import type { Router } from 'vue-router'
import { useAuthStoreWithout } from '@/store/modules'

export function setupPageGuard(router: Router) {
  router.beforeEach((to, from, next) => {
    try {
      const authStore = useAuthStoreWithout()
      if (authStore.userId === undefined) {
        if (to.path !== '/register')
          next({ name: 'register' })
        else
          next()
      }

      else { next() }
    }
    catch (error) {
      console.log(error)
      if (to.path !== '/500')
        next({ name: '500' })
      else
        next()
    }
  })
}

// export const whiteList = ['/login']
// export function setupPageGuardTest(router: Router) {
//   router.beforeEach(async (to, from, next) => {
//     const authStore = useAuthStoreWithout()
//     // 注册和查询余额页面不需要登录验证
//     if (!authStore.session && to.path !== '/balance' && to.path !== '/register') {
//       // 登录态
//       if (authStore.token) {
//         // 在登录时在地址栏输入login 将不跳转
//         if (whiteList.includes(to.path))
//           next({ path: from.path! })
//         else
//           next()
//       }
//       else {
//         // 如果没有登录
//         if (whiteList.includes(to.path))
//           next()
//         else
//           next({ name: 'login' })
//       }
//     }
//     else {
//       next()
//     }
//   })
// }

// router.beforeEach(async (to, from, next) => {
//   const authStore = useAuthStoreWithout()
//   if (!authStore.session) {
//     try {
//       const data = await authStore.getSession()
//       if (String(data.auth) === 'false' && authStore.token)
//         authStore.removeToken()
//       if (to.path === '/500')
//         next({ name: 'Root' })
//       else
//         next()
//     }
//     catch (error) {
//       if (to.path !== '/500')
//         next({ name: '500' })
//       else
//         next()
//     }
//   }
//   else {
//     next()
//   }
// })
