<script setup lang="ts">
import { useCategoryStore } from '@/store'
import { systemInfo } from '@/utils/systemInfo'

definePage({
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '账户管理',
  },
})

const categoryStore = useCategoryStore()

const show = ref(false)
const scrollHeight = ref(300)
const categories = ref(categoryStore.categories)

onMounted(() => {
  nextTick(() => {
    uni.createSelectorQuery().select('#LEDGER_NAVBAR').boundingClientRect((data: UniApp.NodeInfo) => {
      scrollHeight.value = systemInfo.windowHeight - (data.height + 16) // 16为外层view的padding
    }).exec()
  })
})

function handleCreateClick() {
  console.log('handleCreateClick')
}

function handleSortChange(list: any[]) {
  // console.log('handleSortChange', list)
  // categories.value = list
}

function handelItemClick() {
  console.log('点击 item')
}
</script>

<template>
  <page-meta :page-style="`overflow:${show ? 'hidden' : 'visible'};`" />
  <draw-background2 />
  <nav-bar id="LEDGER_NAVBAR">
    <template #title>
      <text> 账户管理 </text>
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
      <drag-sort-list-view expand :gap="8" :list="categories" key-prop="categoryId" :height="scrollHeight" @change="handleSortChange">
        <template #title="{ listItem }">
          <view class="category-title-box" @tap="handelExpandClick">
            <view class="mb-2 font-bold">
              {{ listItem.name }}
            </view>
            <view class="flex justify-between text-sm text-gray-500">
              <view>共{{ listItem.childs.length }}个分类</view>
              <view>{{ listItem.createTime }}</view>
            </view>
          </view>
        </template>
        <template #content="{ listItem }">
          <view v-if="listItem.childs && listItem.childs.length > 0" class="p-2">
            <drag-sort-grid-view :gap="8" :column="4" :list="listItem.childs" key-prop="categoryId" @change="list => handleChildSortChange(list, listItem)">
              <template #content="{ gridItem }">
                <view class="flex flex-col items-center items-center p-2">
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
.action-icon-box {
  @apply: flex items-center justify-center rounded-full bg-gray-50 p-2 px-4;
}

.category-title-box {
  border-radius: 19px;
  box-sizing: border-box;
  padding: 0.7rem;
  // border-bottom: 1px solid #f0f0f0;
}

.category-title {
  display: flex;
  flex-direction: column;
  font-weight: bold;
}
</style>
