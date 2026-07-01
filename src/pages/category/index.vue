<script setup lang="ts">
import type { ICategory } from '@/api/types/category'
import type { ActionItem } from '@/typings'
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
const actions: ActionItem[] = [
  {
    title: '创建',
    icon: 'plus',
    action: handleCreateTap,
  },
]

const dialog = useDialog()
const toast = useToast()
const categoryStore = useCategoryStore()

const show = ref(false)
const scrollHeight = ref(300)
const type = ref(BillTypeEnum.Expend)
const expends = computed(() => {
  return categoryStore.expends
})
const incomes = computed(() => {
  return categoryStore.incomes
})

onMounted(() => {
  nextTick(() => {
    uni.createSelectorQuery().select('#TOP_NAVBAR').boundingClientRect((data: any) => {
      scrollHeight.value = systemInfo.windowHeight - (data.height + 16) // 16为外层view的padding
    }).exec()
  })
})

function handleCreateTap() {
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
  console.log('handleSortChange', list)
}

function handleChildSortChange(list: ICategory[], parent: any) {
  console.log('handleChildSortChange', list, parent as ICategory)
}

function handleChildAdd(parent: any) {
  parent = parent as ICategory
  console.log('handleChildAdd', parent)
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

function handleEditItemTap(item: any) {
  console.log('handleEditItemTap', item as ICategory)
}
</script>

<template>
  <page-meta :page-style="`overflow:${show ? 'hidden' : 'visible'};`" />
  <draw-background2 />
  <nav-bar id="TOP_NAVBAR" :actions="actions" title="分类管理" />
  <view class="w-screen">
    <view class="p-2">
      <drag-sort-list-view expand :gap="8" :list="expends" key-prop="categoryId" :height="scrollHeight" @change="handleSortChange">
        <template #title="{ listItem }">
          <view class="category-title-box">
            <view class="flex items-center justify-between">
              <view class="mr-3 w-10">
                <wd-icon v-if="listItem.expand" name="caret-down" />
                <wd-icon v-else name="caret-right" />
              </view>
              <view class="flex-1 font-bold">
                {{ listItem.name }}
              </view>

              <view class="px-2" @tap.stop="handleEditItemTap(listItem)">
                <wd-icon name="menu" />
              </view>
            </view>
          </view>
        </template>
        <template #content="{ listItem }">
          <view class="p-2">
            <drag-sort-grid-view
              :gap="8" :column="4" :list="listItem.childs" key-prop="categoryId"
              @change="list => handleChildSortChange(list, listItem)"
              @add="handleChildAdd(listItem)"
            >
              <template #content="{ gridItem }">
                <view class="flex flex-col items-center p-2">
                  <wd-img :width="30" round :height="30" :src="gridItem.icon" />
                  <view class="category-item-title">
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
</template>

<style lang="scss" scoped>
.category-title-box {
  border-radius: 19px;
  box-sizing: border-box;
  padding: 0.9rem;
}

.category-item-title {
  font-size: 12px;
}
</style>
