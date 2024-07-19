import { ss } from '@/utils/storage'

const LOCAL_NAME = 'SECRET_TOKEN'
const USER_ID = 'USER_ID'
const DEVICE_ID = 'DEVICE_ID'

export function getToken() {
  return ss.get(LOCAL_NAME)
}

export function setToken(token: string) {
  return ss.set(LOCAL_NAME, token)
}

export function removeToken() {
  return ss.remove(LOCAL_NAME)
}

export function getUserId() {
  return ss.get(USER_ID)
}

export function setUserId(userId: string) {
  return ss.set(USER_ID, userId)
}

export function getDeviceId() {
  return ss.get(DEVICE_ID)
}

export function setDeviceId(deviceId: string) {
  return ss.set(DEVICE_ID, deviceId)
}
