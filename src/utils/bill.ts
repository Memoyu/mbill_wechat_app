import { BillTypeEnum, BillWayEnum } from '@/typings'

export function getBillType(type: BillTypeEnum) {
  return type === BillTypeEnum.Expend ? '支出' : '收入'
}

export function getBillWay(type: BillWayEnum) {
  return type === BillWayEnum.Manual ? '手动记账' : '自动记账'
}

export function getBillColor(type: BillTypeEnum) {
  return type === BillTypeEnum.Expend ? 'var(--mbill-expend-color)' : 'var(--mbill-income-color)'
}
