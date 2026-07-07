<script setup lang="ts">
import type { ICategory } from '@/api/types/category'
import { useCategoryStore } from '@/store'
import { BillTypeEnum } from '@/typings'

const props = defineProps<{
  type: BillTypeEnum
  scrollHeight: number
}>()
const emit = defineEmits(['actions', 'sort-change', 'child-sort-change', 'child-tap'])
defineExpose({
  init,
})

const categoryStore = useCategoryStore()
const isInit = ref(false)

const categories = computed(() => {
  // isInit 用于在init后才赋值数据，不然导致排序组件计算高度有问题
  return isInit.value ? (props.type === BillTypeEnum.Expend ? categoryStore.expends : categoryStore.incomes) : []
})

function init() {
  if (isInit.value)
    return
  isInit.value = true
  // console.log('init', props.type)
}

/**
 * 分类排序触发
 */
function handleSortChange(list: ICategory[]) {
  emit('sort-change', list)
}

/**
 * 分类子项排序触发
 */
function handleChildSortChange(list: ICategory[], parent: any) {
  // console.log('handleChildSortChange', list, parent as ICategory)
  parent = parent as ICategory
  emit('child-sort-change', list, parent)
}

/**
 * 分类操作面板展示
 */
function handleCategoryActions(item: any) {
  emit('actions', item as ICategory)
}

/**
 * 分类子项点击
 */
function handleChildItemTap(parent: any, data: any) {
  // console.log(data, parent, 'com handleChildItemTap')
  // type: add 时为添加按钮，其余为项
  const { item, type } = data
  parent = parent as ICategory
  const child = item as ICategory

  emit('child-tap', type, parent, child)
}
</script>

<template>
  <drag-sort-list-view expand :gap="8" :list="categories" key-prop="categoryId" :height="scrollHeight" @change="handleSortChange">
    <template #title="{ listItem }">
      <view class="category-title-box">
        <view class="flex items-center justify-center">
          <view class="mr-3">
            <wd-icon v-if="listItem.expand" name="caret-down" />
            <wd-icon v-else name="caret-right" />
          </view>
          <bill-icon size="22px" :icon="listItem.icon" :text="listItem.name" />
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
              <view class="category-item-title line-clamp-1 mt-1 text-nowrap">
                {{ gridItem.name }}
              </view>
            </view>
          </template>
        </drag-sort-grid-view>
      </view>
    </template>
  </drag-sort-list-view>
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
