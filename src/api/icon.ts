import type { IIconCatalog } from './types/icon'
import { http } from '@/utils/http'

/**
 * 获取图标目录
 */
export function getIconCatalogs() {
  return http.get<IIconCatalog[]>('icon/list/catalog')
}
