import type { ICategory, IUpdateCategory } from '@/api/types/category'
import { defineStore } from 'pinia'
import {
  createCategory as fetchCreateCategory,
  deleteCategory as fetchDeleteCategory,
  sortCategory as fetchSortCategory,
  updateCategory as fetchUpdateCategory,
  getCategoryGroup,
} from '@/api/category'
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
     * @param icon 颜色
     * @param type 账单类型
     * @param parentId 父分类ID
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

    /**
     * 排序账单分类
     * @param categories 排序后的账单分类
     * @param type 账单类型
     * @param parentId 父分类ID
     */
    const sortCategory = (categories: ICategory[], type: BillTypeEnum, parentId?: string) => {
      const sorts = categories.map((item, index) => {
        return {
          categoryId: item.categoryId,
          sort: index,
        }
      })
      fetchSortCategory(sorts).then(() => {
        // 覆盖父类下的子类
        if (parentId) {
          let list = state.expends
          if (type === BillTypeEnum.Income) {
            list = state.incomes
          }
          const parent = list.find(item => item.categoryId === parentId)
          if (parent) {
            parent.childs = categories
          }
        }
        else {
          // 覆盖根分类
          if (type === BillTypeEnum.Expend) {
            state.expends = categories
          }
          else {
            state.incomes = categories
          }
        }
      })
    }

    /**
     * 更新账本
     * @param update 更新内容
     * @param type 账单类型
     * @param parentId 父分类ID
     */
    const updateCategory = async (update: IUpdateCategory, type: BillTypeEnum, parentId?: string) => {
      // 更新数据
      await fetchUpdateCategory(update)

      let list = state.expends
      if (type === BillTypeEnum.Income) {
        list = state.incomes
      }
      // 添加子分类到指定父类下
      if (parentId) {
        const parent = list.find(item => item.categoryId === parentId)
        // console.log(parent, 'parent')
        if (parent) {
          list = parent.childs || []
        }
      }

      // 更新分类
      const category = list.find(item => item.categoryId === update.categoryId)
      if (category) {
        // console.log(category, 'category')
        category.name = update.name
        category.icon = update.icon
      }
    }

    /**
     * 删除账单分类
     * @param categoryId 账单id
     * @param type 账单类型
     * @param parentId 父分类ID
     */
    const deleteCategory = (categoryId: string, type: BillTypeEnum, parentId?: string) => {
      fetchDeleteCategory(categoryId).then(() => {
        let list = state.expends
        if (type === BillTypeEnum.Income) {
          list = state.incomes
        }
        // 添加子分类到指定父类下
        if (parentId) {
          const parent = list.find(item => item.categoryId === parentId)
          if (parent) {
            list = parent.childs || []
          }
        }

        const index = list.findIndex(l => l.categoryId === categoryId)
        list.splice(index, 1)
      })
    }

    return {
      ...toRefs(state),
      loadCategories,
      createCategory,
      sortCategory,
      updateCategory,
      deleteCategory,
    }
  },
)
