<script setup lang="ts">
import type { ITag } from '@/api/types/tag'
import type { ActionGroup, ActionItem } from '@/typings'
import { useDialog, useToast } from '@wot-ui/ui'
import { useTagStore } from '@/store'
import { systemInfo } from '@/utils/systemInfo'

definePage({
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '标签管理',
  },
})

const tagStore = useTagStore()
const navActions: ActionItem[] = [
  {
    text: '创建',
    icon: 'plus',
    action: handleCreateAction,
  },
]
const tagActions: ActionGroup[] = [
  {
    actions: [
      {
        icon: 'i-carbon-edit',
        text: '编辑标签',
        action: handleEditAction,
      },
      {
        icon: 'i-carbon-package',
        text: '新增子标签',
        action: handleCreateChildAction,
      },
      {
        icon: 'i-carbon-trash-can',
        text: '删除标签',
        type: 'danger',
        action: handleDeleteAction,
      },
    ],
  },
]

const dialog = useDialog()
const toast = useToast()

const editShow = ref(false)
const editTitle = ref('新增标签')
const scrollHeight = ref(300)
const actionShow = ref(false)
const currentTag = ref<ITag>()

const tags = computed(() => tagStore.tags)

const editTag = ref<{
  isCreate: boolean
  name: string
  tagId?: string
  parentId?: string
}>({ isCreate: true, name: '' })

onMounted(() => {
  // 进入管理页面重新加载一下数据
  tagStore.loadTags()
  nextTick(() => {
    uni.createSelectorQuery().select('#TOP_NAVBAR').boundingClientRect((data: any) => {
      scrollHeight.value = systemInfo.windowHeight - (data.height + 16) // 16为外层view的padding
    }).exec()
  })
})

/**
 * 创建标签
 */
function handleCreateAction() {
  // console.log('handleCreateTap')
  editTag.value = {
    isCreate: true,
    name: '',
    parentId: '',
    tagId: '',
  }
  editTitle.value = '创建标签'
  editTag.value.isCreate = true
  editShow.value = true
}

/**
 * 标签排序后触发
 */
function handleSortChange(list: ITag[]) {
  // console.log('handleSortChange', list)
  tagStore.sortTag(list)
}

/**
 * 子标签排序后触发
 */
function handleChildSortChange(list: ITag[], parent: any) {
  // console.log('handleChildSortChange', list, parent as ITag)
  parent = parent as ITag
  tagStore.sortTag(list, parent.tagId)
}

/**
 * 子标签点击
 */
function handleChildItemTap(parent: any, data: any) {
  const { item, type } = data
  parent = parent as ITag
  const child = item as ITag

  if (type === 'add') {
    // 排序组件新增
    createChildTag(parent)
  }
  else {
    // 展示操作面板
    currentTag.value = child
    actionShow.value = true
  }
}

/**
 * 标签更多操作
 */
function handleTagActions(item: any) {
  currentTag.value = item as ITag
  actionShow.value = true
}

/**
 * 编辑标签Action触发
 */
function handleEditAction() {
  // console.log('handleEditAction')
  if (!currentTag.value)
    return
  const { tagId, name, parentId } = currentTag.value

  editTag.value = {
    isCreate: false,
    name,
    tagId,
    parentId,
  }
  editTitle.value = name
  editShow.value = true
}

/**
 * 创建子标签Action触发
 */
function handleCreateChildAction() {
  // console.log('handleCreateChildAction')
  if (!currentTag.value)
    return
  createChildTag(currentTag.value)
}

/**
 * 创建子标签
 */
function createChildTag(parent: ITag) {
  editTag.value = {
    isCreate: true,
    name: '',
    tagId: '',
    parentId: parent.tagId,
  }

  editTitle.value = `${parent.name} 新增子标签`
  editShow.value = true
}

/**
 * 创建/编辑标签
 */
function handleEditConfirm() {
  if (!editTag.value.name)
    return
  const { tagId, name, parentId } = editTag.value

  if (editTag.value.isCreate) {
    tagStore.createTag(name, parentId)
  }
  else {
    if (!tagId) {
      toast.error('更新标签ID不能为空')
      return
    }
    tagStore.updateTag({
      tagId,
      name,
    }, parentId)
  }
}

/**
 * 删除标签Action触发
 */
function handleDeleteAction() {
  // console.log('handleEditAction')
  if (!currentTag.value)
    return
  tagStore.deleteTag(currentTag.value.tagId, currentTag.value.parentId)
}
</script>

<template>
  <page-meta :page-style="`overflow:${editShow ? 'hidden' : 'visible'};`" />
  <draw-background2 />
  <nav-bar id="TOP_NAVBAR" :actions="navActions" title="标签管理" />
  <view class="w-screen">
    <view class="p-2">
      <drag-sort-list-view expand :gap="8" :list="tags" key-prop="tagId" :height="scrollHeight" @change="handleSortChange">
        <template #title="{ listItem }">
          <view class="tag-title-box">
            <view class="flex items-center justify-between">
              <view class="mr-3">
                <wd-icon v-if="listItem.expand" name="caret-down" />
                <wd-icon v-else name="caret-right" />
              </view>
              <view class="flex-1 font-bold">
                {{ listItem.name }}
              </view>

              <view
                class="h-6 w-6 flex items-center justify-center rounded-full bg-white/40 shadow-[0_4px_8px_rgba(0,0,0,0.04)]"
                @tap.stop="handleTagActions(listItem)"
              >
                <wd-icon name="more" />
              </view>
            </view>
          </view>
        </template>
        <template #content="{ listItem }">
          <view class="tag-content-box">
            <drag-sort-grid-view
              :gap="8"
              :column="4"
              :init-height="32"
              :list="listItem.childs"
              key-prop="tagId"
              @change="list => handleChildSortChange(list, listItem)"
              @tap="data => handleChildItemTap(listItem, data)"
            >
              <template #content="{ gridItem }">
                <view class="flex items-center justify-center bg-indigo-500/10 px-1.5 py-2" @tap.stop="() => {}">
                  <view class="tag-item-title line-clamp-1 text-nowrap">
                    {{ gridItem.name }}
                  </view>
                </view>
              </template>
            </drag-sort-grid-view>
          </view>
        </template>
      </drag-sort-list-view>
    </view>
  </view>

  <!-- 更多操作 -->
  <action-popup
    v-model="actionShow"
    :title="currentTag?.name || ''"
    :items="tagActions"
  />

  <center-popup v-model="editShow" :title="editTitle" @confirm="handleEditConfirm">
    <view class="pt-4">
      <wd-input v-model="editTag.name" type="text" placeholder="分类名称" custom-class="custom-input" />
    </view>
  </center-popup>
</template>

<style lang="scss" scoped>
.tag-title-box {
  box-sizing: border-box;
  padding: 0.9rem;
  @apply bg-indigo-50/60;
}

.tag-content-box {
  @apply bg-indigo-50/60 p-2;
}

.tag-item-title {
  font-size: 12px;
}
</style>
