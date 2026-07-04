export interface IIcon {
  catalog: string
  path: string
  url: string
}

export interface IIconCatalog {
  code: string
  name: string
  icons: IIcon[]
}
