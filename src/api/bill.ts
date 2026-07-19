import type { IBill, IBillDateGroup, IBillPageQuery, ICreateBill, IRefunBill, IRelatedBill, IRelationBill, IUpdateBill } from './types/bill'
import type { PageResult } from './types/common'
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
 * 账单退款
 */
export function refundBill(refund: IRefunBill) {
  return http.put('bill/refund', refund)
}

/**
 * 关联账单
 */
export function relationBill(relation: IRelationBill) {
  return http.put('bill/relation', relation)
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
export function getBillDateGroup(query: IBillPageQuery) {
  return http.get<PageResult<IBillDateGroup>>('bill/page/group/date', query)
}

/**
 * 获取账单详情
 */
export function getBill(billId: string) {
  return http.get<IBill>('bill/get', { billId })
}

/**
 * 获取账单关联账单列表
 */
export function getRelatedBill(billId: string) {
  return http.get<IRelatedBill>('bill/related', { billId })
}
