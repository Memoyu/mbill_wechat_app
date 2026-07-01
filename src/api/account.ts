import type { IAccount } from './types/account'
import { http } from '@/utils/http'

/**
 * 获取账单账户组合列表
 */
export function getAccountGroup() {
  return http.get<IAccount[]>('account/list/group')
}
