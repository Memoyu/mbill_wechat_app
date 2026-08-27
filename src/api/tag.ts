import type { ICreateTag, ITag, IUpdateTag, IUpdateTagSort } from './types/tag'
import { http } from '@/utils/http'

/**
 * 创建账单标签
 */
export function createTag(create: ICreateTag) {
  return http.post<ITag>('tag/create', create)
}

/**
 * 更新账单标签
 */
export function updateTag(update: IUpdateTag) {
  return http.put('tag/update', update)
}

/**
 * 排序账单标签
 */
export function sortTag(sorts: IUpdateTagSort[]) {
  return http.put('tag/sort', { sorts })
}

/**
 * 删除账单标签
 */
export function deleteTag(categoryId: string) {
  return http.delete('tag/delete', { categoryId })
}

/**
 * 获取账单标签组合列表
 */
export function getTagGroup() {
  return http.get<ITag[]>('tag/list/group')
}
