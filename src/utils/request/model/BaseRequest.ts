interface BaseRequest<T> {
  deviceType: string
  appVersion: string
  data: T // 泛型数据
  sn: string
  time: string
  userId: string
}
