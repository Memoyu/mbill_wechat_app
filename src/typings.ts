export const BillOptions = ['支出', '收入']

// 枚举定义

/**
 * 账单类型枚举
 * 0 支出，1 收入
 */
export enum BillTypeEnum {
  Expend = 0,
  Income = 1,
}

/**
 * 账单方式枚举
 * 0 手动，1 自动
 */
export enum BillWayEnum {
  Manual = 0,
  Auto = 1,
}

// action 参数
export interface ActionItem {
  icon: string
  text: string
  value?: string
  type?: 'default' | 'warning' | 'danger'
  action: () => void
}

export interface ActionGroup {
  title?: string
  actions: ActionItem[]
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
