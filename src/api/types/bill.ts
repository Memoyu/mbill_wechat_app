import type { BillTypeEnum } from '@/typings'

export interface ICreateBill {
  type: BillTypeEnum
  ledgerId: string
  categoryId: string
  accountId: string
  amount: number
  date: string
  remark?: string
  location?: string
  address?: string
  tagIds?: string []
}

export interface IUpdateBill {
  billId: string
  type: BillTypeEnum
  ledgerId: string
  categoryId: string
  accountId: string
  amount: number
  date: string
  remark?: string
  location?: string
  address?: string
  tagIds?: string []
}

export interface IBillPageQuery {
  beginDate: string
  endDate: string
  ledgerIds: string[]
  type?: BillTypeEnum
  categoryId?: string
  accountId?: string
}

export interface IBillDateGroup {
  date: string
  income: number
  expend: number
  items: IBill[]
}

export interface IBill {
  billId?: string
  type: BillTypeEnum
  ledger: IBillLedger
  category: IBillCategory
  account: IBillAccount
  amount: number
  date: string
  remark?: string
  tags: IBillTag []
  address?: string
}

export interface IBillLedger {
  ledgerId: string
  name: string
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

export interface IBillTag {
  tagId: string
  name: string
}
