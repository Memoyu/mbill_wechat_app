import type { IBill, IBillDateGroup, IBillPageItem, IBillPageQuery, IBillSearchQuery, ICreateBill, IEditRefundBill, IRefundBill, IRelatedBill, IRelationBill, IUpdateBill } from './types/bill'
import type { PageResult } from './types/common'
import { http } from '@/utils/http'

/**
 * 创建账单
 */
export function createBill(create: ICreateBill) {
  return http.post<string>('bill/create', create)
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
 * 账单分页
 */
export function pageBill(query: IBillPageQuery) {
  return http.get<PageResult<IBillDateGroup>>('bill/page', query)
}

/**
 * 账单搜索
 */
export function searchBill(query: IBillSearchQuery) {
  return http.get<PageResult<IBillPageItem>>('bill/search', query)
}

/**
 * 获取账单详情
 */
export function getBill(billId: string) {
  return http.get<IBill>('bill/get', { billId })
}

/**
 * 关联账单
 */
export function relationBill(relation: IRelationBill) {
  return http.put('bill/relation', relation)
}

/**
 * 获取账单关联账单列表
 */
export function getRelatedBill(billId: string) {
  return http.get<IRelatedBill>('bill/related', { billId })
}

/**
 * 创建账单退款
 */
export function createRefundBill(refund: IEditRefundBill) {
  return http.post<IRefundBill>('bill/refund/create', refund)
}

/**
 * 更新账单退款
 */
export function updateRefundBill(refund: IEditRefundBill) {
  return http.put<IRefundBill>('bill/refund/update', refund)
}

/**
 * 删除账单
 */
export function deleteRefundBill(refundId: string) {
  return http.delete('bill/refund/delete', { refundId })
}

/**
 * 获取账单详情
 */
export function getRefundBill(refundId: string) {
  return http.get<IRefundBill>('bill/refund/get', { refundId })
}

/**
 * 获取账单详情
 */
export function getRefundBillList(billId: string) {
  return http.get<IRefundBill[]>('bill/refund/list', { billId })
}
