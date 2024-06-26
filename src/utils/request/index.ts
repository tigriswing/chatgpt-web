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
  const SECRET_KEY = 'dc67b5f0-089d-363d-ada0-5a45d1714c43'

  const loginReqData: LoginReqData = {
    deviceId: 'dc67b5f0-089d-363d-ada0-5a45d1714c43',
    userName: 'A930PAX',
  }

  const postData = new RequestBean<LoginReqData>(
    '1',
    '58',
    loginReqData,
    'dc67b5f0-089d-363d-ada0-5a45d1714c43',
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
      'sn': 'dc67b5f0-089d-363d-ada0-5a45d1714c43', // 设置授权头部
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

export default post
