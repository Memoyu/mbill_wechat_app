import type { IBill, IBillDateGroup, ICreateBill, IUpdateBill } from './types/bill'
import { http } from '@/utils/http'

/**
 * 创建账单
 */
export function createBill(create: ICreateBill) {
  return http.post<IBill>('bill/create', create)
}

/**
 * 更新账单
 */
export function updateBill(update: IUpdateBill) {
  return http.put('bill/update', update)
}

/**
 * 删除账单
 */
export function deleteBill(billId: string) {
  return http.delete('bill/delete', { billId })
}

/**
 * 获取账单按日期分组列表
 */
export function getBillDateGroup() {
  return http.get<IBillDateGroup[]>('bill/page/group/date')
}
