import type { IIconCatalog } from './types/icon'
import { http } from '@/utils'

/**
 * 获取图标目录
 */
export function getIconCatalogs() {
  return http.get<IIconCatalog[]>('icon/list/catalog')
}
