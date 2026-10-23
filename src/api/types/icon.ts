export interface IIcon {
  id: string
  catalog: string
  path: string
  url: string
}

export interface IIconCatalog {
  code: string
  name: string
  count: number
  icons: IIcon[]
}
