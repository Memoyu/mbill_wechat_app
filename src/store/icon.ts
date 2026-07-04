import type { IIconCatalog } from '@/api/types/icon'
import { defineStore } from 'pinia'
import {
  getIconCatalogs,
} from '@/api/icon'

// 初始化状态
const initState: {
  catalogs: IIconCatalog[]
} = {
  catalogs: [],
}

export const useIconStore = defineStore(
  'icons',
  () => {
    const state = reactive({ ...initState })

    /**
     * 加载图标目录数据
     */
    const loadIconCatalogs = async () => {
      state.catalogs = await getIconCatalogs()
    }

    return {
      ...toRefs(state),
      loadIconCatalogs,

    }
  },
)
