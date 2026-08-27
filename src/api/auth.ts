import type { IAuthLoginRes } from '@/api/types/auth'
import { http } from '@/utils/http'

/**
 * 获取微信登录凭证
 * @returns Promise 包含微信登录凭证(code)
 */
export function getWxCode() {
  return new Promise<UniApp.LoginRes>((resolve, reject) => {
    uni.login({
      provider: 'weixin',
      success: res => resolve(res),
      fail: err => reject(new Error(err)),
    })
  })
}

/**
 * 退出登录
 */
export function logout() {
  return http.get<void>('auth/logout')
}

/**
 * 微信登录
 * @param params 微信登录参数，包含code
 * @returns Promise 包含登录结果
 */
export function wxLogin(data: { code: string }) {
  return http.post<IAuthLoginRes>('auth/wx-login', data)
}

/**
 * 刷新token
 * @param refreshToken 刷新token
 */
export function refreshToken(refreshToken: string) {
  return http.post<IAuthLoginRes>('auth/refresh-token', { refreshToken })
}
