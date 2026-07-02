export interface IAccount {
  accountId: string
  name: string
  icon: string
  parentId?: string
  childs?: IAccount[ ]
  createTime?: string
}

export interface ICreateAccount {
  name: string
  icon: string
  parentId?: string
}

export interface IUpdateAccountSort {
  accountId: string
  sort: number
}

export interface IUpdateAccount {
  accountId: string
  name: string
  icon: string
}
