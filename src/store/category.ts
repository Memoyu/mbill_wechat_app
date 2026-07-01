import type { ICategory } from '@/api/types/category'
import { defineStore } from 'pinia'
import { createCategory as fetchCreateCategory, getCategoryGroup } from '@/api/category'
import { BillTypeEnum } from '@/typings'

// 初始化状态
const initState: {
  expends: ICategory[ ]
  incomes: ICategory[ ]
} = {
  expends: [],
  incomes: [],
}

export const useCategoryStore = defineStore(
  'category',
  () => {
    const state = reactive({ ...initState })

    /**
     * 加载账单分类数据
     */
    const loadCategories = async () => {
      const categories = await getCategoryGroup()
      state.expends = categories.filter(category => category.type === 0)
      state.incomes = categories.filter(category => category.type === 1)
    }

    /**
     * 创建账单分类
     * @param name 账本名称
     * @param color 颜色
     */
    const createCategory = async (name: string, icon: string, type: BillTypeEnum, parentId?: string) => {
      const category = await fetchCreateCategory({ name, icon, type, parentId })
      category.childs = []
      let list = state.expends
      if (type === BillTypeEnum.Income) {
        list = state.incomes
      }
      // 添加子分类到指定父类下
      if (parentId) {
        const parent = list.find(item => item.categoryId === parentId)
        if (parent) {
          parent.childs = parent.childs || []
          parent.childs.push(category)
        }
      }
      else {
        // 添加到根分类下
        list.push(category)
      }
    }

    return {
      ...toRefs(state),
      loadCategories,
      createCategory,
    }
  },
)
