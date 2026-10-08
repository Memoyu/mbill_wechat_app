import type { IBillSummaryAmountItem } from '@/api/types/bill'
import { billColors } from '@/constants/billIcons'
import { BillTypeEnum, BillWayEnum } from '@/typings'

export function getBillType(type: BillTypeEnum) {
  return type === BillTypeEnum.Expend ? '支出' : '收入'
}

export function getBillWay(type: BillWayEnum) {
  return type === BillWayEnum.Manual ? '手动记账' : '自动记账'
}

export function getBillColor(type: number) {
  return billColors[type] || ''
}

export function calcHeat(type: number, summary: IBillSummaryAmountItem, item: IBillSummaryAmountItem) {
  let heat = 0
  if (type === 0 && item.expend !== 0) {
    heat = item.expend / summary.expend
  }
  else if (type === 1 && item.income !== 0) {
    heat = item.income / summary.income
  }
  else if (type === 2 && item.income - item.expend !== 0) {
    heat = (item.income - item.expend) / summary.surplus
  }
  return heat === 0 ? 0 : Number.parseFloat((heat + 0.2).toFixed(2))
}
