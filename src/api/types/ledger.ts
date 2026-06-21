import type { IUserBase } from './user'

export interface ILedger {
  ledgerId: string
  name: string
  income: number
  expend: number
  createTime: string
  users: IUserBase[]
  color: number
}

export interface ICreateLedger {
  name: string
  color: number
}

export interface IUpdateLedger {
  ledgerId: string
  name: string
  color: number
}

export interface IUpdateLedgerColor {
  ledgerId: string
  color: number
}
