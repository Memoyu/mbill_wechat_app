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
  console.log('handleSortChange', list)
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
      <drag-sort-view :list="categories" key-prop="categoryId" :height="scrollHeight" @change="handleSortChange">
        <template #content="{ item }">
          <view class="category-item-box" :class="[item.active ? 'bg-gray-200' : '']">
            <view class="category-item-content">
              <view>{{ item.name }}</view>
            </view>
            <view class="category-item-more">
              <text class="i-carbon-draggable" />
            </view>
          </view>
        </template>
      </drag-sort-view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.action-icon-box {
  @apply: flex items-center justify-center rounded-full bg-gray-50 p-2 px-4;
}

.category-item-box {
  display: flex;
  align-items: center;
  border-radius: 19px;
  box-sizing: border-box;
  padding: 0.5rem 0;
  // border-bottom: 1px solid #f0f0f0;
}

.category-item-content {
  margin-left: 0.9rem;
  flex: 1;
  width: calc(100% - 48px);
  display: flex;
  flex-direction: column;
}
.category-item-more {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: #999;
  padding-right: 0.9rem;
}
</style>
