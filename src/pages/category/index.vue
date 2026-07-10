<script setup lang="ts">
import type { ICategory } from '@/api/types/category'
import type { IIcon } from '@/api/types/icon'
import type { ActionGroup, ActionItem } from '@/typings'
import { useDialog, useToast } from '@wot-ui/ui'
import { c } from 'node_modules/vite/dist/node/types.d-aGj9QkWt'
import { useCategoryStore } from '@/store'
import { BillTypeEnum } from '@/typings'
import { systemInfo } from '@/utils/systemInfo'

definePage({
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '分类管理',
  },
})
const typeActions = ['支出', '收入']
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
const expendsRef = ref()
const incomesRef = ref()

const type = ref(BillTypeEnum.Expend)

const editCategory = ref<{
  isCreate: boolean
  name: string
  icon: string
  categoryId?: string
  parentId?: string
}>({ isCreate: true, name: '', icon: '' })

watch(() => type.value, (val) => {
  initCategoryComponent()
})

onMounted(() => {
  // 进入管理页面重新加载一下数据
  categoryStore.loadCategories()
  nextTick(() => {
    uni.createSelectorQuery().select('#TOP_NAVBAR').boundingClientRect((data: any) => {
      scrollHeight.value = systemInfo.windowHeight - (data.height + 16) // 16为外层view的padding
    }).exec()
  })
  initCategoryComponent()
})

function initCategoryComponent() {
  if (type.value === BillTypeEnum.Expend) {
    expendsRef.value.init()
  }
  else {
    incomesRef.value.init()
  }
}

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
function handleChildSortChange(list: ICategory[], parent: ICategory) {
  // console.log('handleChildSortChange', list, parent as ICategory)
  categoryStore.sortCategory(list, type.value, parent.categoryId)
}

/**
 * 分类子项点击
 */
function handleChildItemTap(type: string, parent: ICategory, child: ICategory) {
  // console.log(type, parent, child, 'category handleChildItemTap')
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
function handleCategoryActions(category: ICategory) {
  currentCategory.value = category
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
async function handleEditConfirm(check: (close: boolean) => void) {
  const { isCreate, categoryId, name, icon, parentId } = editCategory.value

  if (!checkCategory(editCategory.value))
    return check(false)
  if (!isCreate && !categoryId) {
    toast.error('分类ID不能为空')
    return check(false)
  }

  if (isCreate) {
    await categoryStore.createCategory(name, icon, type.value, parentId)
  }
  else {
    await categoryStore.updateCategory({ categoryId, name, icon }, type.value, parentId)
  }

  return check(true)
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
  <nav-bar id="TOP_NAVBAR" :actions="navActions" title="分类管理">
    <template #prefix-action>
      <view class="mt-4 max-w-max rounded-full bg-gray-200/50 px-3 py-1">
        <mbill-segmented v-model="type" :options="typeActions" />
      </view>
    </template>
  </nav-bar>
  <view class="w-screen">
    <view class="p-2">
      <wd-tabs v-model="type" animated>
        <wd-tab key="expend" title="支出" :name="BillTypeEnum.Expend">
          <category-drag-sort-view
            ref="expendsRef"
            :type="BillTypeEnum.Expend"
            :scroll-height="scrollHeight"
            @actions="handleCategoryActions"
            @sort-change="handleSortChange"
            @child-sort-change="handleChildSortChange"
            @child-tap="handleChildItemTap"
          />
        </wd-tab>

        <wd-tab key="income" title="收入" :name="BillTypeEnum.Income">
          <category-drag-sort-view
            ref="incomesRef"
            :type="BillTypeEnum.Income"
            :scroll-height="scrollHeight"
            @actions="handleCategoryActions"
            @sort-change="handleSortChange"
            @child-sort-change="handleChildSortChange"
            @child-tap="handleChildItemTap"
          />
        </wd-tab>
      </wd-tabs>
    </view>
  </view>

  <!-- 更多操作 -->
  <action-popup
    v-model="actionShow"
    :title="currentCategory?.name || ''"
    :items="categoryActions"
  />

  <!-- 编辑分类 -->
  <bottom-popup v-model="editShow" :title="editTitle" confirm-text="确认" show-cancel @confirm="handleEditConfirm">
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
// 自定义tabs，隐藏nav
:deep(.wd-tabs) {
  background: none;
}
:deep(.wd-tabs__nav) {
  display: none;
}
</style>
