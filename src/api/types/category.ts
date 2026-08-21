import type { BillTypeEnum } from '@/typings'

export interface IGroupCategory {
  expendTops: ICategory[]
  incomeTops: ICategory[]
  expends: ICategory[]
  incomes: ICategory[]
}

export interface ICategory {
  categoryId: string
  name: string
  icon: string
  type: BillTypeEnum
  parentId?: string
  childs?: ICategory[]
  createTime?: string
}

export interface ICreateCategory {
  name: string
  icon: string
  type: BillTypeEnum
  parentId?: string
}

export interface IUpdateCategorySort {
  categoryId: string
  sort: number
}

export interface IUpdateCategory {
  categoryId: string
  name: string
  icon: string
}
