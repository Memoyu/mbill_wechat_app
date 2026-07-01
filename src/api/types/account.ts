export interface IAccount {
  accountId: string
  name: string
  icon: string
  parentId?: string
  childs?: IAccount[ ]
  createTime?: string
}
