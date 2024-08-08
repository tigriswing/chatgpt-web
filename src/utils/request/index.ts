import type { AxiosProgressEvent, AxiosResponse, GenericAbortSignal } from 'axios'
import type { LoginReqData } from '../request/model/LoginReqData'
import { RequestBean } from '../request/model/RequestBean'
import request from './axios'
import { getMD5Str, getSignature } from './utils'
import { useAuthStore } from '@/store'

// const testIp = 'http://enjoyailife.com/game-api/'
const testIp = 'http://192.168.43.160:8088/'

export interface HttpOption {
  url: string
  data?: any
  method?: string
  headers?: any
  onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void
  signal?: GenericAbortSignal
  beforeRequest?: () => void
  afterRequest?: () => void
}

export interface Response<T = any> {
  data: T
  message: string | null
  status: string
  code: string
}

function getDeviceId(): string {
  const authStore = useAuthStore()
  let deviceId = authStore.deviceId ? authStore.deviceId : ''
  if (deviceId.length === 0)
    deviceId = generateRandom()

  return deviceId
}

function generateRandom() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 32; i++)
    result += chars.charAt(Math.floor(Math.random() * chars.length))

  return result
}

function getUserId(): string {
  const authStore = useAuthStore()
  return authStore.userId ? authStore.userId : ''
}

function httpV2<T = any>(
  { url, data, method, headers, signal, beforeRequest, afterRequest }: HttpOption,
) {
  const successHandler = (res: AxiosResponse<Response<T>>) => {
    if (res.data.code === '0000' || typeof res.data === 'string')
      return res.data

    if (res.data.status === 'Unauthorized') {
      const authStore = useAuthStore()
      authStore.removeToken()
      window.location.reload()
    }

    return Promise.reject(res.data)
  }

  const failHandler = (error: Response<Error>) => {
    afterRequest?.()
    throw new Error(error?.message || 'Error')
  }

  beforeRequest?.()

  method = method || 'GET'

  // 获取签名
  const sign = getSignature(data, headers.sn)

  // 将签名添加到请求参数中
  const params: RequestBean<any> & { sign: string } = {
    ...data,
    sign,
  }

  // const params = Object.assign(typeof data === 'function' ? data() : data ?? {}, {})
  url = testIp + url
  return method === 'GET'
    ? request.get(url, { params, signal }).then(successHandler, failHandler)
    : request.post(url, params, { headers, signal }).then(successHandler, failHandler)
}

export function getV2<T = any>(
  { url, data, method = 'GET', signal, beforeRequest, afterRequest }: HttpOption,
): Promise<Response<T>> {
  return httpV2<T>({
    url,
    method,
    data,
    signal,
    beforeRequest,
    afterRequest,
  })
}

export function postV2<T = any>(
  { url, data, method = 'POST', headers, signal, beforeRequest, afterRequest }: HttpOption,
): Promise<Response<T>> {
  return httpV2<T>({
    url,
    method,
    data,
    headers,
    signal,
    beforeRequest,
    afterRequest,
  })
}

export function login(): Promise<any> {
  const deviceId = getDeviceId()
  const loginReqData: LoginReqData = {
    userName: 'A930PAX',
  }

  const postData = new RequestBean<LoginReqData>(
    '1',
    '58',
    loginReqData,
    '',
    '1719133012191',
    '',
  )

  const headers = {
    'sn': deviceId, // 设置授权头部
    'Content-Type': 'application/json', // 设置内容类型头部
  }

  // 发送POST请求
  return postV2({ url: 'account/login', data: postData, headers })
}

export function chat(chatData: Chat.ChatAskBean, signal?: GenericAbortSignal, modelType?: string): Promise<any> {
  const requestUrl = 'openai/flowchat'
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

  const deviceId = getDeviceId()
  const postData = new RequestBean<Chat.ChatAskBean>(
    '1',
    '58',
    chatData,
    deviceId,
    '1719474174721',
    getUserId(),
  )

  const headers = {
    'sn': deviceId, // 设置授权头部
    'Content-Type': 'application/json', // 设置内容类型头部
  }

  return postV2({ url: requestUrl, data: postData, headers, signal })
}

export function chatFlow(reqId: string, currentLen: string, signal?: GenericAbortSignal): Promise<any> {
  const chatData: Chat.ChatFlowRequest = {
    reqId,
    currentLen,
  }

  const deviceId = getDeviceId()
  const postData = new RequestBean<Chat.ChatFlowRequest>(
    '1',
    '58',
    chatData,
    deviceId,
    '1719474174721',
    getUserId(),
  )

  const headers = {
    'sn': deviceId, // 设置授权头部
    'Content-Type': 'application/json', // 设置内容类型头部
  }

  return postV2({ url: 'openai/flow', data: postData, headers, signal })
}

export function sendSms(mobile: string, requestId: string, actionType: string): Promise<any> {
  const sendSmsData: Chat.SendSms = {
    mobile,
    requestId,
    actionType,
  }

  const postData = new RequestBean<Chat.SendSms>(
    '1',
    '58',
    sendSmsData,
    '',
    '1719474174721',
    '',
  )

  const headers = {
    'sn': getDeviceId(), // 设置授权头部
    'Content-Type': 'application/json', // 设置内容类型头部
  }

  return postV2({ url: 'sms/send', data: postData, headers })
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

  const deviceId = getDeviceId()
  const postData = new RequestBean<Chat.VerifySms>(
    '1',
    '58',
    verifySmsData,
    deviceId,
    '1719474174721',
    '',
  )

  const headers = {
    'sn': deviceId, // 设置授权头部
    'Content-Type': 'application/json', // 设置内容类型头部
  }

  return postV2({ url: 'sms/verify', data: postData, headers })
}

export function loginByMobile(mobile: string, password: string): Promise<any> {
  password = getMD5Str(password, '')

  const verifySmsData: Chat.MobileLogin = {
    mobile,
    password,
  }

  const deviceId = getDeviceId()
  const postData = new RequestBean<Chat.MobileLogin>(
    '1',
    '58',
    verifySmsData,
    deviceId,
    '1719474174721',
    '',
  )

  const headers = {
    'sn': deviceId, // 设置授权头部
    'Content-Type': 'application/json', // 设置内容类型头部
  }

  return postV2({ url: 'sms/login', data: postData, headers })
}
