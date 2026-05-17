export interface ICategory {
  categoryId: string
  name: string
  icon: string
  childs?: ICategory[ ]
  createTime?: string
}
