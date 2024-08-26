import { defineStore } from 'pinia'
import { getDeviceId, getToken, getUserId, removeToken, setDeviceId, setToken, setUserId } from './helper'
import { store } from '@/store/helper'

interface SessionResponse {
  auth: boolean
  model: 'ChatGPTAPI' | 'ChatGPTUnofficialProxyAPI'
}

export interface AuthState {
  token: string | undefined
  userId: string | undefined
  deviceId: string | undefined
  session: SessionResponse | null
}

export const useAuthStore = defineStore('auth-store', {
  state: (): AuthState => ({
    token: getToken(),
    userId: getUserId(),
    deviceId: getDeviceId(),
    session: null,
  }),

  getters: {
    isChatGPTAPI(state): boolean {
      return state.session?.model === 'ChatGPTAPI'
    },
  },

  actions: {
    setToken(token: string) {
      this.token = token
      setToken(token)
    },

    setUserId(userId: string) {
      this.userId = userId
      setUserId(userId)
    },

    setDeviceId(deviceId: string) {
      this.deviceId = deviceId
      setDeviceId(deviceId)
    },

    removeToken() {
      this.token = undefined
      removeToken()
    },

    logout() {
      this.userId = undefined
      setUserId(this.userId)
      this.removeToken()
    },
  },
})

export function useAuthStoreWithout() {
  return useAuthStore(store)
}
