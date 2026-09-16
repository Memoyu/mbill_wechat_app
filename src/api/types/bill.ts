import type { IPageQuery } from './common'
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

export interface IEditBill {
  billId?: string
  type: BillTypeEnum
  ledger: IBillLedger
  category: IBillCategory
  account: IBillAccount
  amount: number
  date: string
  remark?: string
  tags?: IBillTag []
  address?: string
  location?: string
}

export interface IRelationBill {
  billId: string
  relationIds: string []
}

export interface IBillQuery extends IPageQuery {
  beginDate?: string
  endDate?: string
  type?: BillTypeEnum
  ledgerIds?: string[]
  categoryIds?: string[]
  accountIds?: string[]
  tagIds?: string[]
}

export interface IBillSearchQuery extends IBillQuery {
  keyword?: string
  amountMin?: number
  amountMax?: number
  excludeBillIds?: string[]
}

export interface IBillPageQuery extends IBillQuery {

}

export interface IBillDateGroup {
  date: string
  income: number
  expend: number
  items: IBillPageItem[]
}

export interface IBillPageItem extends IBill {

}

export interface IBill {
  billId: string
  type: BillTypeEnum
  ledger: IBillLedger
  category: IBillCategory
  account: IBillAccount
  amount: number
  refundAmount: number
  date: string
  remark: string
  tags: IBillTag []
  location: string
  address: string
  createTime: Date
}

export interface IBillLedger {
  ledgerId: string
  name: string
}

export interface IBillCategory {
  categoryId: string
  name: string
  icon: string
}

export interface IBillAccount {
  accountId: string
  name: string
  icon: string
}

export interface IBillTag {
  tagId: string
  name: string
}

export interface IRelatedBill {
  income: number
  expend: number
  items: IBill[]
}

export interface IEditRefundBill {
  refundId?: string
  billId: string
  accountId: string
  amount: number
  date: string
  remark?: string
}

export interface IRefundBill {
  refundId: string
  billId: string
  account: IBillAccount
  amount: number
  amountBefore: number
  date: string
  remark?: string
}

export interface IBillSummaryAmountQuery extends IBillQuery {
  /**
   * 分组汇总: 0：不分组，1：按月，2：按日，3：按月、日
   */
  series: 0 | 1 | 2 | 3
}

export interface IBillSummaryAmount {
  summary: IBillSummaryAmountItem
  items: IBillSummaryAmount []
}

export interface IBillSummaryAmountItem {
  date: string
  income: number
  expend: number
  surplus: number
  incomeAvg: number
  expendAvg: number
  surplusAvg: number
  expendHighest: number
  expendLowst: number
  incomeHighest: number
  incomeLowst: number
}

export interface IBillSummaryCategoryQuery extends IBillQuery {
}

export interface IBillSummaryCategory {
  expends: IBillSummaryCategoryItem []
  incomes: IBillSummaryCategoryItem []
}

export interface IBillSummaryCategoryItem {
  categoryId: string
  name: string
  icon: string
  count: number
  amount: number
  percent: number
}

export interface IBillSummaryAccountQuery extends IBillQuery {
}

export interface IBillSummaryAccount {
  expends: IBillSummaryAccountItem []
  incomes: IBillSummaryAccountItem []
}

export interface IBillSummaryAccountItem {
  accountId: string
  name: string
  icon: string
  count: number
  amount: number
  percent: number
}

export interface IBillSummaryTagQuery extends IBillQuery {
}

export interface IBillSummaryTag {
  tags: IBillSummaryTagItem []
}

export interface IBillSummaryTagItem {
  tagId: string
  name: string
  income: number
  expend: number
  incomeCount: number
  expendCount: number
}
