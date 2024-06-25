import axios, { type AxiosResponse } from 'axios'
import CryptoJS from 'crypto-js'

import type { LoginReqData } from '../request/model/LoginReqData'
import { RequestBean } from '../request/model/RequestBean'
import { useAuthStore } from '@/store'

const service = axios.create({
  baseURL: import.meta.env.VITE_GLOB_API_URL,
})

service.interceptors.request.use(
  (config) => {
    const token = useAuthStore().token
    if (token)
      config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => {
    return Promise.reject(error.response)
  },
)

service.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    if (response.status === 200)
      return response

    throw new Error(response.status.toString())
  },
  (error) => {
    return Promise.reject(error)
  },
)

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

// 签名函数
function getSignature(params: RequestBean<any>, secretKey: string): string {
  // 将参数按字典序排序
  const keys = Object.keys(params).sort() as Array<keyof RequestBean<any>>
  const sortedParams: Partial<Record<keyof RequestBean<any>, any>> = {}

  keys.forEach((key) => {
    sortedParams[key] = params[key]
  })

  // 拼接成字符串
  const paramString = sort(params)

  // 使用秘钥进行HMAC-SHA256加密
  const signature = getMD5Str(paramString, mask(secretKey))

  return signature
}

function sort(map: { [key: string]: any }): string {
  const keys = Object.keys(map).sort()
  const buffer = []
  for (let i = 0; i < keys.length; i++) {
    let value = map[keys[i]]
    if (typeof value === 'object')
      value = JSON.stringify(value)

    buffer.push(`${keys[i]}=${value}`)
  }
  return buffer.join('&').replace(/"/g, '')
}

function getMD5Str(str: string, key: string): string {
  str = str + key
  try {
    const hash = CryptoJS.MD5(str)
    return hash.toString()
  }
  catch (error) {
    console.log('Error: ', error)
    return ''
  }
}

function mask(baseKey: string): string {
  // 转换大写
  baseKey = baseKey.toUpperCase()

  // 遍历内容
  const macAddrArray = baseKey.split('')
  const length = macAddrArray.length
  const newMacAddrArray = new Array(length)

  for (let i = 0; i < length; i++) {
    if (macAddrArray[i] >= '0' && macAddrArray[i] <= '9') { // 数字转换为小写字母+2
      newMacAddrArray[i] = String.fromCharCode('c'.charCodeAt(0) - '0'.charCodeAt(0) + macAddrArray[i].charCodeAt(0))
    }
    else if (macAddrArray[i] >= 'A' && macAddrArray[i] <= 'F') { // A-F大小字母+3
      newMacAddrArray[i] = String.fromCharCode(macAddrArray[i].charCodeAt(0) + 3)
    }
    else if (macAddrArray[i] >= 'G' && macAddrArray[i] <= 'Z') {
      newMacAddrArray[i] = String.fromCharCode(macAddrArray[i].charCodeAt(0) - 1)// G-Z大小字母-1
    }
  }
  // 移位
  // 第一位和最后一位
  if (length >= 3) {
    let tmp = newMacAddrArray[0]
    newMacAddrArray[0] = newMacAddrArray[length - 1]
    newMacAddrArray[length - 1] = tmp
    // 第二位和最后第三位
    tmp = newMacAddrArray[1]
    newMacAddrArray[1] = newMacAddrArray[length - 3]
    newMacAddrArray[length - 3] = tmp
    // 第三位和最后第二位
    tmp = newMacAddrArray[2]
    newMacAddrArray[2] = newMacAddrArray[length - 2]
    newMacAddrArray[length - 2] = tmp
  }
  return newMacAddrArray.join('')
}

const config = {
  headers: {
    'sn': 'dc67b5f0-089d-363d-ada0-5a45d1714c43', // 设置授权头部
    'Content-Type': 'application/json', // 设置内容类型头部
    // 在这里可以添加更多的自定义头部
  },
}

// 发送POST请求
axios.post('http://localhost:8088/account/login', signedPostData, config)
  .then((response) => {
    console.log('Response:', response.data)
  })
  .catch((error) => {
    console.error('Error posting data:', error)
  })

export default service
