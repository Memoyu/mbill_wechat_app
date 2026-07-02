<script setup lang="ts">
import type { ICategory } from '@/api/types/category'
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
  console.log('handleCreateTap')
  dialog
    .prompt({
      title: '新增',
      inputProps: {
        placeholder: '分类名称',
      },
      inputPattern: /.+/,
      inputError: '输入内容不能为空',
    })
    .then((res) => {
      categoryStore.createCategory(res.value as string, 'icon', type.value).then((res) => {
        toast.success('创建成功')
      }).catch((err) => {
        console.log('err', err)
        toast.error('创建失败')
      })
    })
    .catch((err) => {
      console.log(err, 'ee')
    })
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

function handleChildCreate(parent: any) {
  parent = parent as ICategory
  // console.log('handleChildAdd', parent)
  dialog
    .prompt({
      title: `${parent.name} 下新增`,
      inputProps: {
        placeholder: '分类名称',
      },
      inputPattern: /.+/,
      inputError: '输入内容不能为空',
    })
    .then((res) => {
      categoryStore.createCategory(res.value as string, 'icon', type.value, parent.categoryId).then((res) => {
        toast.success('创建成功')
      }).catch((err) => {
        console.log('err', err)
        toast.error('创建失败')
      })
    })
    .catch((err) => {
      console.log(err, 'ee')
    })
}

function handleCategoryActions(item: any) {
  currentCategory.value = item as ICategory
  actionShow.value = true
}

function handleEditAction() {
  // console.log('handleEditAction')
}

function handleCreateChildAction() {
  // console.log('handleCreateChildAction')
  if (!currentCategory.value)
    return
  handleChildCreate(currentCategory.value)
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
              <!-- <view class="px-2" @tap.stop="handleCategoryActions(listItem)">
                <wd-icon name="menu" />
              </view> -->
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
              @add="handleChildCreate(listItem)"
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
