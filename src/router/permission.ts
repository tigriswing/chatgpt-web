import type { Router } from 'vue-router'
import { login } from '@/utils/request'
import { useAuthStoreWithout } from '@/store/modules'

export function setupPageGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    try {
      const authStore = useAuthStoreWithout()
      if (authStore.token === undefined) {
        const data = await login()
        if (data.code === '0000') {
          authStore.setToken(data.data.userId)
          next()
        }
      }
      else {
        next()
      }
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
