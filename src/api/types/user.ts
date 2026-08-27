import type { IAuthLoginRes } from './auth'

// 认证模式类型
export type AuthMode = 'single' | 'double'

/**
 * 用户信息
 */export interface IUserInfo extends IUserBase {
  email?: string
  mobile?: string
  roles?: UserRole[]
  createTime?: Date
  billDay: number
  billCount: number
}

export interface IUserBase {
  userId: string
  username: string
  nickname: string
  avatar: string
}

export interface UserRole {
  roleId: string
  name: string
  type: number
  description: string
}

/**
 * 更新用户信息
 */
export interface IUpdateUser {
  userId: string
  username: string
  nickname: string
  avatar?: string
  email?: string
  mobile?: string
}

// 认证存储数据结构
export interface AuthStorage {
  mode: AuthMode
  tokens: IAuthLoginRes
  userInfo?: IUserInfo
  loginTime: number // 登录时间戳
}

/**
 * 上传成功的信息
 */
export interface IUploadSuccessInfo {
  fileId: number
  originalName: string
  fileName: string
  storagePath: string
  fileHash: string
  fileType: string
  fileBusinessType: string
  fileSize: number
}
