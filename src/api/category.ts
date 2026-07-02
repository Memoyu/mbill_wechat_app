import type { ICategory, ICreateCategory, IUpdateCategory, IUpdateCategorySort } from './types/category'
import { http } from '@/utils/http'

/**
 * 创建账单分类
 */
export function createCategory(create: ICreateCategory) {
  return http.post<ICategory>('category/create', create)
}
/**
 * 更新账单分类
 */
export function updateCategory(update: IUpdateCategory) {
  return http.put('category/sort', update)
}
/**
 * 排序账单分类
 */
export function sortCategory(sorts: IUpdateCategorySort[]) {
  return http.put('category/update', { sorts })
}

/**
 * 删除账单分类
 */
export function deleteCategory(categoryId: string) {
  return http.delete('category/delete', { categoryId })
}

/**
 * 获取账单分类组合列表
 */
export function getCategoryGroup() {
  return http.get<ICategory[]>('category/list/group')
}
