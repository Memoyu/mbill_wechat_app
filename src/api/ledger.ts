import type { ICreateLedger, ILedger, ILedgerWithCreater, IUpdateLedger, IUpdateLedgerColor, IUpdateLedgerSort } from './types/ledger'
import { http } from '@/utils/http'

/**
 * 创建账本
 */
export function createLedger(create: ICreateLedger) {
  return http.post<ILedger>('ledger/create', create)
}

/**
 * 加入账本
 */
export function joinLedger(ledgerId: string) {
  return http.put<ILedger>('ledger/join', { ledgerId })
}

/**
 * 排序账本
 */
export function sortLedger(sorts: IUpdateLedgerSort[]) {
  return http.put('ledger/sort', { sorts })
}

/**
 * 修改账本
 */
export function updateLedger(update: IUpdateLedger) {
  return http.put('ledger/update', update)
}

/**
 * 修改账本颜色
 */
export function updateLedgerColor(items: IUpdateLedgerColor[]) {
  return http.put('ledger/update/color', { items })
}

/**
 * 删除账本
 */
export function deleteLedger(ledgerId: string) {
  return http.delete('ledger/delete', { ledgerId })
}

/**
 * 获取账本列表
 */
export function getLedgerList() {
  return http.get<ILedger[]>('ledger/list')
}

/**
 * 获取账本详情
 */
export function getLedger(ledgerId: string) {
  return http.get<ILedgerWithCreater>('ledger/get', { ledgerId })
}
