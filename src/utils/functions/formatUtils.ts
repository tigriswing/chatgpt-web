// utils/validation.ts

/**
 * 校验短信验证码是否有效
 * @param code 短信验证码
 * @returns boolean
 */
export function validateSmsCode(code: string): boolean {
  const smsCodeRegex = /^[0-9]{6}$/ // 短信验证码一般为6位数字
  return smsCodeRegex.test(code)
}

/**
   * 校验密码是否符合标准
   * @param password 密码
   * @returns boolean
   */
export function validatePassword(password: string): boolean {
  return password.length >= 8
  // const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
  // // 密码至少8个字符，至少1个字母和1个数字
  // return passwordRegex.test(password)
}

/**
   * 校验手机号是否有效
   * @param phoneNumber 手机号
   * @returns boolean
   */
export function validatePhoneNumber(phoneNumber: string): boolean {
  const phoneNumberRegex = /^1[3-9]\d{9}$/
  // 简单的手机号验证，支持以13-19开头的11位数字
  return phoneNumberRegex.test(phoneNumber)
}
