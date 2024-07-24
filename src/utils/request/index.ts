import type { AxiosProgressEvent, AxiosResponse, GenericAbortSignal } from 'axios'
import type { LoginReqData } from '../request/model/LoginReqData'
import { RequestBean } from '../request/model/RequestBean'
import request from './axios'
import { getMD5Str, getSignature } from './utils'
import { useAuthStore } from '@/store'

// const testIp = 'http://enjoyailife.com/game-api/'
const testIp = 'http://192.168.43.160:8088/'

const UserId = '2311087K0KMRFYY8' // test
// const UserId = '2310091P8BN55DS8'
const SECRET_KEY = 'ff9f52f2-edaf-3ac5-bdf0-cd3468d79278'

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

function http<T = any>(
  { url, data, method, headers, onDownloadProgress, signal, beforeRequest, afterRequest }: HttpOption,
) {
  const successHandler = (res: AxiosResponse<Response<T>>) => {
    const authStore = useAuthStore()

    if (res.data.status === 'Success' || typeof res.data === 'string')
      return res.data

    if (res.data.status === 'Unauthorized') {
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

  const params = Object.assign(typeof data === 'function' ? data() : data ?? {}, {})

  return method === 'GET'
    ? request.get(url, { params, signal, onDownloadProgress }).then(successHandler, failHandler)
    : request.post(url, params, { headers, signal, onDownloadProgress }).then(successHandler, failHandler)
}

export function get<T = any>(
  { url, data, method = 'GET', onDownloadProgress, signal, beforeRequest, afterRequest }: HttpOption,
): Promise<Response<T>> {
  return http<T>({
    url,
    method,
    data,
    onDownloadProgress,
    signal,
    beforeRequest,
    afterRequest,
  })
}

export function post<T = any>(
  { url, data, method = 'POST', headers, onDownloadProgress, signal, beforeRequest, afterRequest }: HttpOption,
): Promise<Response<T>> {
  return http<T>({
    url,
    method,
    data,
    headers,
    onDownloadProgress,
    signal,
    beforeRequest,
    afterRequest,
  })
}

function httpV2<T = any>(
  { url, data, method, headers, signal, beforeRequest, afterRequest }: HttpOption,
) {
  const successHandler = (res: AxiosResponse<Response<T>>) => {
    const authStore = useAuthStore()

    if (res.data.code === '0000' || typeof res.data === 'string')
      return res.data

    if (res.data.status === 'Unauthorized') {
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
  const sign = getSignature(data, SECRET_KEY)

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
  const loginReqData: LoginReqData = {
    deviceId: SECRET_KEY,
    userName: 'A930PAX',
  }

  const postData = new RequestBean<LoginReqData>(
    '1',
    '58',
    loginReqData,
    SECRET_KEY,
    '1719133012191',
    '',
  )

  const headers = {
    'sn': SECRET_KEY, // 设置授权头部
    'Content-Type': 'application/json', // 设置内容类型头部
  }

  // 发送POST请求
  return postV2({ url: 'account/login', data: postData, headers })
}

export function chat(chatData: Chat.ChatAskBean, signal?: GenericAbortSignal, modelType?: string): Promise<any> {
  let requestUrl = 'openai/v9/flowchat'
  if (modelType === '3') { // gpt-4 TODO
    chatData.mType = '14'
    requestUrl = 'wd/v2/flowchat'
  }

  const postData = new RequestBean<Chat.ChatAskBean>(
    '1',
    '58',
    chatData,
    SECRET_KEY,
    '1719474174721',
    UserId,
  )

  const headers = {
    'sn': SECRET_KEY, // 设置授权头部
    'Content-Type': 'application/json', // 设置内容类型头部
  }

  return postV2({ url: requestUrl, data: postData, headers, signal })
}

export function chatFlow(reqId: string, currentLen: string, signal?: GenericAbortSignal): Promise<any> {
  const chatData: Chat.ChatFlowRequest = {
    reqId,
    currentLen,
  }

  const postData = new RequestBean<Chat.ChatFlowRequest>(
    '1',
    '58',
    chatData,
    SECRET_KEY,
    '1719474174721',
    UserId,
  )

  const headers = {
    'sn': SECRET_KEY, // 设置授权头部
    'Content-Type': 'application/json', // 设置内容类型头部
  }

  return postV2({ url: 'openai/flow', data: postData, headers, signal })
}

export function sendSms(mobile: string, requestId: string): Promise<any> {
  const sendSmsData: Chat.SendSms = {
    mobile,
    requestId,
  }

  const postData = new RequestBean<Chat.SendSms>(
    '1',
    '58',
    sendSmsData,
    SECRET_KEY,
    '1719474174721',
    '',
  )

  const headers = {
    'sn': SECRET_KEY, // 设置授权头部
    'Content-Type': 'application/json', // 设置内容类型头部
  }

  return postV2({ url: 'sms/send', data: postData, headers })
}

export function verifySms(mobile: string, password: string, smsCode: string, requestId: string): Promise<any> {
  password = getMD5Str(password, '')

  const verifySmsData: Chat.VerifySms = {
    mobile,
    requestId,
    smsCode,
    password,
  }

  const postData = new RequestBean<Chat.VerifySms>(
    '1',
    '58',
    verifySmsData,
    SECRET_KEY,
    '1719474174721',
    '',
  )

  const headers = {
    'sn': SECRET_KEY, // 设置授权头部
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

  const postData = new RequestBean<Chat.MobileLogin>(
    '1',
    '58',
    verifySmsData,
    SECRET_KEY,
    '1719474174721',
    '',
  )

  const headers = {
    'sn': SECRET_KEY, // 设置授权头部
    'Content-Type': 'application/json', // 设置内容类型头部
  }

  return postV2({ url: 'sms/login', data: postData, headers })
}

export default post
