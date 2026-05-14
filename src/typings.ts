// 枚举定义
export enum BillTypeEnum {
  Expend = 0,
  Income = 1,
}

export enum BillWayEnum {
  Manual = 0,
  Auto = 1,
}

// action 参数
export interface ActionItem {
  title: string
  icon: string
  danger?: boolean
  action: () => void
}

// uni.uploadFile文件上传参数
export interface IUniUploadFileOptions {
  file?: File
  files?: UniApp.UploadFileOptionFiles[]
  filePath?: string
  name?: string
  formData?: any
}

/** 工具类型：删除字符串开头的第一个斜杠 */
export type RemoveLeadingSlash<S extends string> = S extends `/${infer Rest}` ? Rest : S

/** 工具类型：删除联合类型中每个字符串的第一个斜杠 */
export type RemoveLeadingSlashFromUnion<T extends string> = T extends any ? RemoveLeadingSlash<T> : never
