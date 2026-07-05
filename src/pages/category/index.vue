<script setup lang="ts">
import type { ICategory } from '@/api/types/category'
import type { IIcon } from '@/api/types/icon'
import type { ActionGroup, ActionItem } from '@/typings'
import { useDialog, useToast } from '@wot-ui/ui'
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
const toast = useToast()
const categoryStore = useCategoryStore()

const editShow = ref(false)
const editTitle = ref('创建分类')
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
  isCreate: boolean
  name: string
  icon: string
  categoryId?: string
  parentId?: string
}>({ isCreate: true, name: '', icon: '' })

onMounted(() => {
  // 进入管理页面重新加载一下数据
  categoryStore.loadCategories()
  nextTick(() => {
    uni.createSelectorQuery().select('#TOP_NAVBAR').boundingClientRect((data: any) => {
      scrollHeight.value = systemInfo.windowHeight - (data.height + 16) // 16为外层view的padding
    }).exec()
  })
})

/**
 * 新增分类Action触发
 */
function handleCreateAction() {
  editCategory.value = {
    isCreate: true,
    name: '',
    icon: '',
    parentId: '',
    categoryId: '',
  }
  editTitle.value = '创建分类'
  editCategory.value.isCreate = true
  editShow.value = true
}

/**
 * 分类编辑参数检查
 */
function checkCategory(data: any) {
  // console.log('checkCategory', data)
  if (!data.name || data.name.length < 1) {
    toast.error('分类名称不能为空')
    return false
  }

  return true
}

/**
 * 分类排序触发
 */
function handleSortChange(list: ICategory[]) {
  // console.log('handleSortChange', list)
  categoryStore.sortCategory(list, type.value)
}

/**
 * 分类子项排序触发
 */
function handleChildSortChange(list: ICategory[], parent: any) {
  // console.log('handleChildSortChange', list, parent as ICategory)
  parent = parent as ICategory
  categoryStore.sortCategory(list, type.value, parent.categoryId)
}

/**
 * 分类子项点击
 */
function handleChildItemTap(parent: any, data: any) {
  const { item, type } = data
  parent = parent as ICategory
  const child = item as ICategory

  if (type === 'add') {
    createChildCategory(parent)
  }
  else {
    // 展示操作面板
    currentCategory.value = child
    actionShow.value = true
  }
}

/**
 * 分类操作面板展示
 */
function handleCategoryActions(item: any) {
  currentCategory.value = item as ICategory
  actionShow.value = true
}

/**
 * 编辑分类Action触发
 */
function handleEditAction() {
  // console.log('handleEditAction', currentCategory.value)

  if (!currentCategory.value)
    return
  const { categoryId, name, icon, parentId } = currentCategory.value

  editCategory.value = {
    isCreate: false,
    name,
    icon,
    categoryId,
    parentId,
  }
  editTitle.value = name
  editShow.value = true
}

/**
 * 新增子分类Action触发
 */
function handleCreateChildAction() {
  // console.log('handleCreateChildAction')
  if (!currentCategory.value)
    return
  createChildCategory(currentCategory.value)
}

/**
 * 创建子分类
 */
function createChildCategory(parent: ICategory) {
  // console.log('createChildCategory', parentId)
  editCategory.value = {
    isCreate: true,
    name: '',
    icon: '',
    categoryId: '',
    parentId: parent.categoryId,
  }

  editTitle.value = `${parent.name} 新增子分类`
  editShow.value = true
}

/**
 * 分类图标选择
 */
function handleIconSelected(icon: IIcon) {
  editCategory.value.icon = icon.url
  // console.log('handleIconSelected', icon, editCategory.value)
}

/**
 * 创建/编辑分类
 */
function handleEditConfirm() {
  if (!checkCategory(editCategory.value))
    return
  const { categoryId, name, icon, parentId } = editCategory.value

  if (editCategory.value.isCreate) {
    categoryStore.createCategory(name, icon, type.value, parentId)
  }
  else {
    if (!categoryId) {
      toast.error('更新分类ID不能为空')
      return
    }
    categoryStore.updateCategory({
      categoryId,
      name,
      icon,
    }, type.value, parentId)
  }
}

/**
 * 删除分类Action触发
 */
function handleDeleteAction() {
  // console.log('handleEditAction')
  if (!currentCategory.value)
    return
  categoryStore.deleteCategory(currentCategory.value.categoryId, type.value, currentCategory.value.parentId)
}
</script>

<template>
  <page-meta :page-style="`overflow:${editShow ? 'hidden' : 'visible'};`" />
  <draw-background2 />
  <nav-bar id="TOP_NAVBAR" :actions="navActions" title="分类管理" />
  <view class="w-screen">
    <view class="p-2">
      <drag-sort-list-view expand :gap="8" :list="expends" key-prop="categoryId" :height="scrollHeight" @change="handleSortChange">
        <template #title="{ listItem }">
          <view class="category-title-box">
            <view class="flex items-center justify-center">
              <view class="mr-3">
                <wd-icon v-if="listItem.expand" name="caret-down" />
                <wd-icon v-else name="caret-right" />
              </view>
              <bill-icon size="20px" :icon="listItem.icon" :text="listItem.name" />
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
              :column="5"
              :init-height="62"
              :list="listItem.childs"
              key-prop="categoryId"
              @change="list => handleChildSortChange(list, listItem)"
              @tap="data => handleChildItemTap(listItem, data)"
            >
              <template #content="{ gridItem }">
                <view class="flex flex-col items-center p-2">
                  <!-- <wd-img :width="32" :height="32" :src="gridItem.icon" round :lazy-load="true" :show-error="false" :show-loading="false" /> -->
                  <bill-icon :icon="gridItem.icon" :text="gridItem.name" />
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

  <!-- 编辑分类 -->
  <bottom-popup v-model="editShow" :title="editTitle" max-height="h-50vh" confirm-text="确认" :show-cancel="false" @confirm="handleEditConfirm">
    <template #title>
      <view class="flex items-center pb-2 pt-4">
        <!-- <wd-img :width="32" :height="32" :src="editCategory.icon" round :lazy-load="true" :show-error="false" :show-loading="false" /> -->
        <bill-icon :icon="editCategory.icon" :text="editCategory.name" />
        <wd-input v-model="editCategory.name" type="text" placeholder="分类名称" custom-class="custom-input" />
      </view>
    </template>

    <view>
      <icon-picker
        @selected="handleIconSelected"
      />
    </view>
  </bottom-popup>
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
