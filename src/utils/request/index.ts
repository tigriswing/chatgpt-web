import type { AxiosProgressEvent, AxiosResponse, GenericAbortSignal } from 'axios'
import axios from 'axios'
import type { LoginReqData } from '../request/model/LoginReqData'
import { RequestBean } from '../request/model/RequestBean'
import request from './axios'
import { getSignature } from './utils'
import { useAuthStore } from '@/store'

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

export function login(): Promise<any> {
  const SECRET_KEY = 'ff9f52f2-edaf-3ac5-bdf0-cd3468d79278'

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

  // 获取签名
  const sign = getSignature(postData, SECRET_KEY)

  // 将签名添加到请求参数中
  const signedPostData: RequestBean<any> & { sign: string } = {
    ...postData,
    sign,
  }

  const config = {
    headers: {
      'sn': SECRET_KEY, // 设置授权头部
      'Content-Type': 'application/json', // 设置内容类型头部
    },
  }

  const successHandler = (res: AxiosResponse<Response>) => {
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
    throw new Error(error?.message || 'Error')
  }

  // 发送POST请求
  return axios.post('http://localhost:8088/account/login', signedPostData, config)
    .then(successHandler, failHandler)
}

export function chat(): Promise<any> {
  const SECRET_KEY = 'ff9f52f2-edaf-3ac5-bdf0-cd3468d79278'

  const chatAssData: Chat.ChatItemInfo = {
    role: 'system',
    content: '以表格的形式列出中国各个省份GDP和人口',
  }

  const chatData: Chat.ChatItemData = {
    systemArray: [chatAssData],
    userQuery: ' ',
    assArray: [],
  }

  const postData = new RequestBean<Chat.ChatItemData>(
    '1',
    '58',
    chatData,
    SECRET_KEY,
    '1719474174721',
    '2311087K0KMRFYY8',
  )

  // 获取签名
  const sign = getSignature(postData, SECRET_KEY)

  // 将签名添加到请求参数中
  const signedPostData: RequestBean<any> & { sign: string } = {
    ...postData,
    sign,
  }

  const config = {
    headers: {
      'sn': SECRET_KEY, // 设置授权头部
      'Content-Type': 'application/json', // 设置内容类型头部
    },
  }

  const successHandler = (res: AxiosResponse<Response>) => {
    const authStore = useAuthStore()

    if (res.data.code === '0000' || typeof res.data === 'string')
      return res.data

    return Promise.reject(res.data)
  }

  const failHandler = (error: Response<Error>) => {
    throw new Error(error?.message || 'Error')
  }

  // 发送POST请求
  return axios.post('http://localhost:8088/openai/v9/flowchat', signedPostData, config)
    .then(successHandler, failHandler)
}

export function chatFlow(reqId: string, currentLen: string): Promise<any> {
  const SECRET_KEY = 'ff9f52f2-edaf-3ac5-bdf0-cd3468d79278'

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
    '2311087K0KMRFYY8',
  )

  // 获取签名
  const sign = getSignature(postData, SECRET_KEY)

  // 将签名添加到请求参数中
  const signedPostData: RequestBean<any> & { sign: string } = {
    ...postData,
    sign,
  }

  const config = {
    headers: {
      'sn': SECRET_KEY, // 设置授权头部
      'Content-Type': 'application/json', // 设置内容类型头部
    },
  }

  const successHandler = (res: AxiosResponse<Response>) => {
    const authStore = useAuthStore()

    if (res.data.code === '0000' || typeof res.data === 'string')
      return res.data

    return Promise.reject(res.data)
  }

  const failHandler = (error: Response<Error>) => {
    throw new Error(error?.message || 'Error')
  }

  // 发送POST请求
  return axios.post('http://localhost:8088/openai/flow', signedPostData, config)
    .then(successHandler, failHandler)
}

export default post
