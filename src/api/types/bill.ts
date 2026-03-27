import type { BillTypeEnum } from '@/typings'

export interface BillGroupRes {
  date: string
  income: number
  expend: number
  bills: BillRes[]
}

export interface BillRes {
  billId: string
  type: BillTypeEnum
  category: BillCategoryRes
  account: BillAccountRes
  amount: number
  date: Date
  remark?: string
  tags: string []
  address?: string
}

export interface BillCategoryRes {
  categoryId: string
  name: string
  icon?: string
}

export interface BillAccountRes {
  accountId: string
  name: string
  icon: string
}
