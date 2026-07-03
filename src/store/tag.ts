import type { ITag, IUpdateTag } from '@/api/types/tag'
import { defineStore } from 'pinia'
import {
  createTag as fetchCreateTag,
  deleteTag as fetchDeleteTag,
  sortTag as fetchSortTag,
  updateTag as fetchUpdateTag,
  getTagGroup,
} from '@/api/tag'

// 初始化状态
const initState: {
  tags: ITag[ ]
} = {
  tags: [],
}

export const useTagStore = defineStore(
  'tag',
  () => {
    const state = reactive({ ...initState })

    /**
     * 加载账单标签数据
     */
    const loadTags = async () => {
      state.tags = await getTagGroup()
    }

    /**
     * 创建账单标签
     * @param name 账本名称
     * @param parentId 父标签ID
     */
    const createTag = async (name: string, parentId?: string) => {
      const tag = await fetchCreateTag({ name, parentId })
      tag.childs = []

      if (parentId) {
        const parent = state.tags.find(item => item.tagId === parentId)
        if (parent) {
          parent.childs = parent.childs || []
          parent.childs.push(tag)
        }
      }
      else {
        // 添加到根标签下
        state.tags.push(tag)
      }
    }

    /**
     * 排序账单标签
     * @param tags 排序后的账单标签
     * @param parentId 父标签ID
     */
    const sortTag = (tags: ITag[], parentId?: string) => {
      const sorts = tags.map((item, index) => {
        return {
          tagId: item.tagId,
          sort: index,
        }
      })
      fetchSortTag(sorts).then(() => {
        if (parentId) {
          const parent = state.tags.find(item => item.tagId === parentId)
          if (parent) {
            parent.childs = tags
          }
        }
        else {
          // 覆盖根标签
          state.tags = tags
        }
      })
    }

    /**
     * 更新账本
     * @param update 更新内容
     * @param parentId 父标签ID
     */
    const updateTag = async (update: IUpdateTag, parentId?: string) => {
      // 更新数据
      await fetchUpdateTag(update)

      let list = state.tags
      // 添加子标签到指定父类下
      if (parentId) {
        const parent = list.find(item => item.tagId === parentId)
        if (parent) {
          list = parent.childs || []
        }
      }

      // 更新标签
      const tag = list.find(item => item.tagId === update.tagId)
      if (tag) {
        tag.name = update.name
      }
    }

    /**
     * 删除账单标签
     * @param tagId 账单id
     * @param parentId 父标签ID
     */
    const deleteTag = (tagId: string, parentId?: string) => {
      fetchDeleteTag(tagId).then(() => {
        let list = state.tags
        // 添加子标签到指定父类下
        if (parentId) {
          const parent = list.find(item => item.tagId === parentId)
          if (parent) {
            list = parent.childs || []
          }
        }

        const index = list.findIndex(l => l.tagId === tagId)
        list.splice(index, 1)
      })
    }

    return {
      ...toRefs(state),
      loadTags,
      createTag,
      sortTag,
      updateTag,
      deleteTag,
    }
  },
)
