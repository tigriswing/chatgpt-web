import type { GenericAbortSignal } from 'axios'
import type { LoginReqData } from '../utils/request/model/LoginReqData'
// import { post } from '@/utils/request'
import { getMD5Str } from '../utils/request/utils'
import { commCallHttp } from '../utils/request/index'

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
