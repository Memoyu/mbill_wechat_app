import type { ICreateLedger, ILedger, IUpdateLedger, IUpdateLedgerColor } from './types/ledger'
import { http } from '@/utils/http'

/**
 * 创建账本
 */
export function createLedger(create: ICreateLedger) {
  return http.post<ILedger>('ledger/create', create)
}

/**
 * 修改账本
 */
export function updateLedger(update: IUpdateLedger) {
  return http.put('ledger/update', update)
}

/**
 * 获取账本列表
 */
export function getLedgerList() {
  return http.get<ILedger[]>('ledger/list')
}

/**
 * 修改账本颜色
 */
export function updateLedgerColor(items: IUpdateLedgerColor[]) {
  return http.put('ledger/update/color', { items })
}
