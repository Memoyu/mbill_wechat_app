import type { IUpdateUser, IUserInfo } from './types/user'
import { http } from '@/utils/http'

/**
 * 获取用户信息
 */
export function getUser() {
  return http.get<IUserInfo>('user/get')
}

/**
 * 修改用户信息
 */
export function updateUser(update: IUpdateUser) {
  return http.put('user/update', update)
}
