import type { IAccount, ICreateAccount, IUpdateAccount, IUpdateAccountSort } from './types/account'
import { http } from '@/utils/http'

/**
 * 创建账单账户
 */
export function createAccount(create: ICreateAccount) {
  return http.post<IAccount>('account/create', create)
}

/**
 * 更新账单账户
 */
export function updateAccount(update: IUpdateAccount) {
  return http.put('account/update', update)
}

/**
 * 排序账单账户
 */
export function sortAccount(sorts: IUpdateAccountSort[]) {
  return http.put('account/sort', { sorts })
}

/**
 * 删除账单账户
 */
export function deleteAccount(categoryId: string) {
  return http.delete('account/delete', { categoryId })
}

/**
 * 获取账单账户组合列表
 */
export function getAccountGroup() {
  return http.get<IAccount[]>('account/list/group')
}
