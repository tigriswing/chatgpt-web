import type { AxiosProgressEvent, AxiosResponse, GenericAbortSignal } from 'axios'

import { RequestBean } from '../request/model/RequestBean'
import request from './axios'
import { getSignature } from './utils'
import { useAuthStore } from '@/store'

const testIp = 'https://enjoyailife.com/game-api/'
// const testIp = 'http://192.168.43.160:8088/'

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

export function commCallHttp<T>(data: T, url: string, signal?: GenericAbortSignal): Promise<any> {
  const deviceId = getDeviceId()

  const postData = new RequestBean<T>(
    '2',
    '58',
    data,
    deviceId,
    `${Date.now()}`,
    getUserId(),
  )

  const headers = {
    'sn': deviceId, // 设置授权头部
    'Content-Type': 'application/json', // 设置内容类型头部
  }

  return postV2({ url, data: postData, headers, signal })
}
