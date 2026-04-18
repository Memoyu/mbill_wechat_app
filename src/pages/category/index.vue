<script setup lang="ts">
import { useCategoryStore } from '@/store'
import { systemInfo } from '@/utils/systemInfo'

definePage({
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '分类管理',
  },
})

const categoryStore = useCategoryStore()

const show = ref(false)
const scrollHeight = ref(300)
const categories = ref([])

onMounted(() => {
  nextTick(() => {
    uni.createSelectorQuery().select('#LEDGER_NAVBAR').boundingClientRect((data: UniApp.NodeInfo) => {
      scrollHeight.value = systemInfo.windowHeight - (data.height + 16) // 16为外层view的padding
    }).exec()
  })
})

function handleCreateClick() {
  console.log('handleCreateClick')
  categories.value = categoryStore.categories
}

function handleSortChange(list: any[]) {
  console.log('handleSortChange', list)
}

function handleChildSortChange(list: any[], parent) {
  console.log('handleChildSortChange', list, parent)
}

function handleTapItem(item) {
  // console.log('handleTapItem', item)
}

function handelListItemTap() {
  // console.log('展开')
}
</script>

<template>
  <page-meta :page-style="`overflow:${show ? 'hidden' : 'visible'};`" />
  <draw-background2 />
  <nav-bar id="LEDGER_NAVBAR">
    <template #title>
      <text> 分类管理 </text>
    </template>
    <template #action>
      <view class="flex items-center gap-3">
        <view class="action-icon-box" @tap="handleCreateClick">
          <text class="iconfont icon-plus title-icon" />
          <text class="ml-2 text-xs">创建</text>
        </view>
      </view>
    </template>
  </nav-bar>
  <view class="w-screen">
    <view class="p-2">
      <drag-sort-list-view-test expand :gap="8" :list="categories" key-prop="categoryId" :height="scrollHeight" @change="handleSortChange">
        <template #title="{ listItem }">
          <view class="category-title-box" @tap="handelListItemTap">
            <view class="flex items-center justify-between">
              <view class="flex-1">
                <view class="mb-2 font-bold">
                  {{ listItem.name }}
                </view>
                <view class="flex justify-between text-sm text-gray-500">
                  <view>共{{ listItem.childs.length }}个子类</view>
                  <view>{{ listItem.createTime }}</view>
                </view>
              </view>
              <view class="ml-3">
                <wd-icon v-if="listItem.expand" name="arrow-down" size="22px" />
                <wd-icon v-else name="arrow-right" size="22px" />
              </view>
            </view>
          </view>
        </template>
        <template #content="{ listItem }">
          <view v-if="listItem.childs && listItem.childs.length > 0" class="p-2">
            <drag-sort-grid-view-test :gap="8" :column="4" :list="listItem.childs" key-prop="categoryId" @change="list => handleChildSortChange(list, listItem)">
              <template #content="{ gridItem }">
                <view class="flex flex-col items-center items-center p-2">
                  <wd-img :width="30" round :height="30" :src="gridItem.icon" />
                  <view class="category-item-title">
                    {{ gridItem.name }}
                  </view>
                </view>
              </template>
            </drag-sort-grid-view-test>
          </view>
        </template>
      </drag-sort-list-view-test>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.action-icon-box {
  @apply: flex items-center justify-center rounded-full bg-gray-50 p-2 px-4;
}

.category-title-box {
  border-radius: 19px;
  box-sizing: border-box;
  padding: 0.7rem;
}
</style>
