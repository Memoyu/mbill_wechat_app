import type { IUserBase } from './user'

export interface ILedgerBase {
  ledgerId: string
  name: string
  createTime: string
  users: IUserBase[]
  color: number
  sort: number
}

export interface ILedger extends ILedgerBase {
  income: number
  expend: number
}

export interface ILedgerWithCreater extends ILedgerBase {
  creater: IUserBase
}

export interface ICreateLedger {
  name: string
  color: number
}

export interface IUpdateLedger {
  ledgerId: string
  name: string
}

export interface IUpdateLedgerColor {
  ledgerId: string
  color: number
}

export interface IUpdateLedgerSort {
  ledgerId: string
  sort: number
}
