import type { AxiosProgressEvent, GenericAbortSignal } from 'axios'
import type { LoginReqData } from '../utils/request/model/LoginReqData'
// import { post } from '@/utils/request'
import { getMD5Str } from '../utils/request/utils'
import { commCallHttp } from '../utils/request/index'
import { useAuthStore, useSettingStore } from '@/store'

export function fetchChatConfig<T = any>() {
  // return post<T>({
  //   url: '/config',
  // })
}

export function fetchChatAPIProcess<T = any>(
  params: {
    prompt: string
    options?: { conversationId?: string; parentMessageId?: string }
    signal?: GenericAbortSignal
    onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void },
) {
  const settingStore = useSettingStore()
  const authStore = useAuthStore()

  let data: Record<string, any> = {
    prompt: params.prompt,
    options: params.options,
  }

  if (authStore.isChatGPTAPI) {
    data = {
      ...data,
      systemMessage: settingStore.systemMessage,
      temperature: settingStore.temperature,
      top_p: settingStore.top_p,
    }
  }

  // return post<T>({
  //   url: '/chat-process',
  //   data,
  //   signal: params.signal,
  //   onDownloadProgress: params.onDownloadProgress,
  // })
}

export function fetchSession<T>() {
  // return post<T>({
  //   url: '/session',
  // })
}

export function fetchVerify<T>(token: string) {
  // return post<T>({
  //   url: '/verify',
  //   data: { token },
  // })
}

export function login(): Promise<any> {
  const loginReqData: LoginReqData = {
    userName: 'WebH5',
  }

  return commCallHttp(loginReqData, 'account/login')
}

export function chat(chatData: Chat.ChatAskBean, signal?: GenericAbortSignal, modelType?: string): Promise<any> {
  if (modelType === '1') { // deepseek
    chatData.modelType = '201'
  }
  else if (modelType === '2') { // 4o mini
    chatData.modelType = '101'
  }
  else if (modelType === '3') { // gpt-4 TODO
    chatData.modelType = '102'
  }
  else if (modelType === '4') { // gpt-4 TODO
    chatData.modelType = '104'
  }
  else {
    chatData.modelType = '201'
  }

  return commCallHttp(chatData, 'openai/flowchat', signal)
}

export function chatFlow(reqId: string, currentLen: string, signal?: GenericAbortSignal): Promise<any> {
  const chatData: Chat.ChatFlowRequest = {
    reqId,
    currentLen,
  }

  return commCallHttp(chatData, 'openai/flow', signal)
}

export function sendSms(mobile: string, requestId: string, actionType: string): Promise<any> {
  const sendSmsData: Chat.SendSms = {
    mobile,
    requestId,
    actionType,
  }

  return commCallHttp(sendSmsData, 'sms/send')
}

export function verifySms(mobile: string, password: string, smsCode: string,
  requestId: string, actionType: string): Promise<any> {
  password = getMD5Str(password, '')

  const verifySmsData: Chat.VerifySms = {
    mobile,
    requestId,
    smsCode,
    password,
    actionType,
  }

  return commCallHttp(verifySmsData, 'sms/verify')
}

export function loginByMobile(mobile: string, password: string): Promise<any> {
  password = getMD5Str(password, '')

  const verifySmsData: Chat.MobileLogin = {
    mobile,
    password,
  }

  return commCallHttp(verifySmsData, 'sms/login')
}
