import type { ICategory, ICreateCategory } from './types/category'
import { http } from '@/utils/http'

/**
 * 创建账单分类
 */
export function createCategory(create: ICreateCategory) {
  return http.post<ICategory>('category/create', create)
}

/**
 * 获取账单分类组合列表
 */
export function getCategoryGroup() {
  return http.get<ICategory[]>('category/list/group')
}
