export interface IQiniuUploadToken {
  token: string
  host: string
}

export interface IPageQuery {
  size?: number
  page?: number
  sort?: string
}

export interface IPageResult<T> {
  items: T[]
  total: number
}
