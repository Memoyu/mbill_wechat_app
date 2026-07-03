export interface ITag {
  tagId: string
  name: string
  parentId?: string
  childs?: ITag[]
  createTime?: string
}

export interface ICreateTag {
  name: string
  parentId?: string
}

export interface IUpdateTagSort {
  tagId: string
  sort: number
}

export interface IUpdateTag {
  tagId: string
  name: string
}
