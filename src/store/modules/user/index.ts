import { defineStore } from 'pinia'
import type { ChatModel, UserInfo, UserState } from './helper'
import { defaultSetting, getLocalState, setLocalState } from './helper'

export const useUserStore = defineStore('user-store', {
  state: (): UserState => getLocalState(),
  actions: {
    updateUserInfo(userInfo: Partial<UserInfo>) {
      this.userInfo = { ...this.userInfo, ...userInfo }
      this.recordState()
    },

    resetUserInfo() {
      this.userInfo = { ...defaultSetting().userInfo }
      this.recordState()
    },

    recordState() {
      setLocalState(this.$state)
    },

    setUserChatModel(chatModel: ChatModel) {
      this.chatModel = { ...this.chatModel, ...chatModel }
      this.recordState()
    },

    getAllChatModel() {
      return [{
        label: 'DeepSeek',
        key: '1',
        description: 'This is model DeepSeek',
      }, {
        label: 'ChatGPT 3.5',
        key: '2',
        description: 'This is model ChatGPT 3.5',
      }, {
        label: 'ChatGPT 4.0',
        key: '3',
        description: 'This is model ChatGPT 4.0',
      }, {
        label: 'ChatGPT 4.0 Web',
        key: '4',
        description: '带搜索功能',
      }]
    },
  },
})
