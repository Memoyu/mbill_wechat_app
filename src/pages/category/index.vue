<script setup lang="ts">
import type { ICategory } from '@/api/types/category'
import type { ActionGroup, ActionItem } from '@/typings'
import { useDialog, useToast } from '@wot-ui/ui'
import { icons } from '@/constants/billIcons'
import { useCategoryStore } from '@/store'
import { BillTypeEnum } from '@/typings'
import { systemInfo } from '@/utils/systemInfo'

definePage({
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '分类管理',
  },
})
const navActions: ActionItem[] = [
  {
    text: '创建',
    icon: 'plus',
    action: handleCreateAction,
  },
]
const categoryActions: ActionGroup[] = [
  {
    actions: [
      {
        icon: 'i-carbon-edit',
        text: '编辑分类',
        action: handleEditAction,
      },
      {
        icon: 'i-carbon-package',
        text: '新增子分类',
        action: handleCreateChildAction,
      },
      {
        icon: 'i-carbon-trash-can',
        text: '删除分类',
        type: 'danger',
        action: handleDeleteAction,
      },
    ],
  },
]

const dialog = useDialog()
const editDialog = useDialog('category-edit-dialog')
const toast = useToast()
const categoryStore = useCategoryStore()

const show = ref(false)
const scrollHeight = ref(300)
const actionShow = ref(false)
const currentCategory = ref<ICategory>()

const type = ref(BillTypeEnum.Expend)
const expends = computed(() => {
  return categoryStore.expends
})
const incomes = computed(() => {
  return categoryStore.incomes
})

const editCategory = ref<{
  name: string
  icon: string
}>({ name: '', icon: '' })

onMounted(() => {
  // 进入管理页面重新加载一下数据
  categoryStore.loadCategories()
  nextTick(() => {
    uni.createSelectorQuery().select('#TOP_NAVBAR').boundingClientRect((data: any) => {
      scrollHeight.value = systemInfo.windowHeight - (data.height + 16) // 16为外层view的padding
    }).exec()
  })
})

function handleCreateAction() {
  // console.log('handleCreateTap')
  editCategory.value = {
    name: '',
    icon: '',
  }
  editDialog.confirm({
    title: '新增',
    beforeConfirm: () => {
      return checkCategory(editCategory.value)
    },
  }).then(async () => {
    const { name, icon } = editCategory.value
    await categoryStore.createCategory(name, icon, type.value)
  }).catch(() => {
    // console.log('点击了取消')
  })
}

function checkCategory(data: any) {
  console.log('checkCategory', data)
  if (!data.name || data.name.length < 1) {
    toast.error('分类名称不能为空')
    return false
  }

  if (!data.icon || data.icon.length < 1) {
    toast.error('分类图标不能为空')
    return false
  }

  return true
}

function handleSortChange(list: ICategory[]) {
  // console.log('handleSortChange', list)
  categoryStore.sortCategory(list, type.value)
}

function handleChildSortChange(list: ICategory[], parent: any) {
  // console.log('handleChildSortChange', list, parent as ICategory)
  parent = parent as ICategory
  categoryStore.sortCategory(list, type.value, parent.categoryId)
}
function handleChildItemTap(parent: any, data: any) {
  const { item, type } = data
  parent = parent as ICategory
  const child = item as ICategory

  if (type === 'add') {
    handleCreateChild(parent)
  }
  else {
    currentCategory.value = child
    handleUpdate(parent.categoryId)
  }
}
function handleCreateChild(parent: ICategory) {
  parent = parent as ICategory
  // console.log('handleChildAdd', parent)
  editCategory.value = {
    name: '',
    icon: '',
  }

  editDialog.confirm({
    title: `${parent.name} 新增子分类`,
    beforeConfirm: () => {
      return checkCategory(editCategory.value)
    },
  }).then(async () => {
    const { name, icon } = editCategory.value
    await categoryStore.createCategory(name, icon, type.value, parent.categoryId)
  }).catch(() => {
    // console.log('点击了取消')
  })
}

function handleCategoryActions(item: any) {
  currentCategory.value = item as ICategory
  actionShow.value = true
}

function handleEditAction() {
  // console.log('handleEditAction')

  handleUpdate()
}

function handleUpdate(parentId?: string) {
  // console.log('handleEditAction')

  if (!currentCategory.value)
    return
  const { categoryId, name, icon } = currentCategory.value

  editCategory.value = {
    name,
    icon,
  }

  editDialog.confirm({
    title: name,
    beforeConfirm: () => {
      return checkCategory(editCategory.value)
    },
  }).then(async () => {
    const { name, icon } = editCategory.value
    await categoryStore.updateCategory({ categoryId, name, icon }, type.value, parentId)
  }).catch(() => {
    // console.log('点击了取消')
  })
}

function handleCreateChildAction() {
  // console.log('handleCreateChildAction')
  if (!currentCategory.value)
    return
  handleCreateChild(currentCategory.value)
}

function handleDeleteAction() {
  // console.log('handleEditAction')
  if (!currentCategory.value)
    return
  categoryStore.deleteCategory(currentCategory.value.categoryId, type.value, currentCategory.value.parentId)
}
</script>

<template>
  <page-meta :page-style="`overflow:${show ? 'hidden' : 'visible'};`" />
  <draw-background2 />
  <nav-bar id="TOP_NAVBAR" :actions="navActions" title="分类管理" />
  <view class="w-screen">
    <view class="p-2">
      <drag-sort-list-view expand :gap="8" :list="expends" key-prop="categoryId" :height="scrollHeight" @change="handleSortChange">
        <template #title="{ listItem }">
          <view class="category-title-box">
            <view class="flex items-center justify-between">
              <view class="mr-3">
                <wd-icon v-if="listItem.expand" name="caret-down" />
                <wd-icon v-else name="caret-right" />
              </view>
              <mbill-icon size="20px" :icon="listItem.icon" />
              <view class="ml-1 flex-1 font-bold">
                {{ listItem.name }}
              </view>

              <view
                class="h-6 w-6 flex items-center justify-center rounded-full bg-white/40 shadow-[0_4px_8px_rgba(0,0,0,0.04)]"
                @tap.stop="handleCategoryActions(listItem)"
              >
                <wd-icon name="more" />
              </view>
            </view>
          </view>
        </template>
        <template #content="{ listItem }">
          <view class="category-content-box">
            <drag-sort-grid-view
              :gap="8"
              :column="4"
              :init-height="62"
              :list="listItem.childs"
              key-prop="categoryId"
              @change="list => handleChildSortChange(list, listItem)"
              @tap="data => handleChildItemTap(listItem, data)"
            >
              <template #content="{ gridItem }">
                <view class="flex flex-col items-center p-2">
                  <mbill-icon :icon="gridItem.icon" />
                  <view class="category-item-title mt-1">
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
    :title="currentCategory?.name || ''"
    :items="categoryActions"
  />

  <!-- 编辑账本 -->
  <wd-dialog selector="category-edit-dialog">
    <wd-input v-model="editCategory.name" type="text" placeholder="账本名称" custom-class="custom-input" />

    <!-- 颜色网格 -->
    <view class="mt-2 h-50 overflow-y-auto p-2">
      <view class="grid grid-cols-5 gap-4">
        <view
          v-for="icon in icons"
          :key="icon"
          class="bill-icons flex content-center justify-center rounded-md p-2 text-center text-6 shadow-sm transition-all duration-200"
          :class="[editCategory.icon === icon ? 'ring-2 ring-indigo-500 ring-offset-2' : '', icon]"
          hover-class="scale-95 shadow-md"
          :hover-start-time="0"
          :hover-stay-time="200"
          @tap="editCategory.icon = icon"
        />
      </view>
    </view>
  </wd-dialog>
</template>

<style lang="scss" scoped>
.category-title-box {
  box-sizing: border-box;
  padding: 0.9rem;
  @apply bg-indigo-50/60;
}

.category-content-box {
  @apply bg-indigo-50/60 p-2;
}

.category-item-title {
  font-size: 12px;
}
</style>
