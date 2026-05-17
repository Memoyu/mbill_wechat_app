export interface IAccount {
  accountId: string
  name: string
  icon: string
  childs?: IAccount[ ]
  createTime?: string
}
