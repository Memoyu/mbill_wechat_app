import type { BillTypeEnum } from '@/typings'

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
