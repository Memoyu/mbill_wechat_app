import type { INotice } from './types/notice'
import { http } from '@/utils/http'

/**
 * 获取公告列表
 */
export function getNoticeList() {
  return http.get<INotice[]>('notice/list')
}
