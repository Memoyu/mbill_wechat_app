import type { BillTypeEnum } from '@/typings'

export interface BillGroupRes {
  date: string
  income: number
  expend: number
  bills: IBill[]
}

export interface IBill {
  billId: string
  type: BillTypeEnum
  category: IBillCategory
  account: IBillAccount
  amount: number
  date: Date
  remark?: string
  tags: string []
  address?: string
}

export interface IBillCategory {
  categoryId: string
  name: string
  icon: string
  parent?: IBillCategory
}

export interface IBillAccount {
  accountId: string
  name: string
  icon: string
  parent?: IBillAccount
}
