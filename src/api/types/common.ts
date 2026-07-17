export interface IQiniuUploadToken {
  token: string
  host: string
}

export interface PageResult<T> {
  items: T[]
  total: number
}
