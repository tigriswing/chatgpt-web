import type { Router } from 'vue-router'
import { login } from '@/utils/request'

export function setupPageGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    // next()
    login().then((data) => {
      console.log(`the data is ${data.code}`)
      next()
    }).catch((error) => {
      console.log(error)
    })
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
