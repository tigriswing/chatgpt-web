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
        description: '国内最强大的模型',
      }, {
        label: '灵动AI',
        key: '2',
        description: '轻巧但功能强大的模型',
      }, {
        label: '智能AI',
        key: '3',
        description: '我们最强大模型，适合解决复杂的难题',
      }, {
        label: '智能AI Web',
        key: '4',
        description: '带搜索功能',
      }]
    },
  },
})
