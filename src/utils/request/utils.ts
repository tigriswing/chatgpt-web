import CryptoJS from 'crypto-js'
import type { RequestBean } from '../request/model/RequestBean'

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

// 签名函数
export function getSignature(params: RequestBean<any>, secretKey: string): string {
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
