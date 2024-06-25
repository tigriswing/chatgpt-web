import './BaseRequest'

export class RequestBean<T> implements BaseRequest<T> {
  deviceType: string
  appVersion: string
  data: T
  sn: string
  time: string
  userId: string

  constructor(
    deviceType: string,
    appVersion: string,
    data: T,
    sn: string,
    time: string,
    userId: string,
  ) {
    this.deviceType = deviceType
    this.appVersion = appVersion
    this.data = data
    this.sn = sn
    this.time = time
    this.userId = userId
  }
}
