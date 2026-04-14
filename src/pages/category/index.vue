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

function handelExpandClick() {
  console.log('展开')
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
      <drag-sort-view-test expand :gap="8" :list="categories" key-prop="categoryId" :height="scrollHeight" @change="handleSortChange">
        <template #title="{ item }">
          <view class="category-title-box" @tap="handelExpandClick">
            <view class="category-title">
              <view>{{ item.name }}</view>
            </view>
          </view>
        </template>
        <template #content="{ item }">
          <view v-if="item.childs && item.childs.length > 0" class="grid grid-cols-4 gap-4 p-2">
            <view v-for="c in item.childs" :key="c.categoryId">
              <view class="flex flex-col items-center">
                <wd-img :width="30" round :height="30" :src="c.icon" />
                <view class="category-item-title">
                  {{ c.name }}
                </view>
              </view>
            </view>
          </view>
        </template>
      </drag-sort-view-test>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.action-icon-box {
  @apply: flex items-center justify-center rounded-full bg-gray-50 p-2 px-4;
}

.category-title-box {
  display: flex;
  align-items: center;
  border-radius: 19px;
  box-sizing: border-box;
  padding: 0.5rem 0;
  // border-bottom: 1px solid #f0f0f0;
}

.category-title {
  margin-left: 0.9rem;
  flex: 1;
  width: calc(100% - 48px);
  display: flex;
  flex-direction: column;
  font-weight: bold;
}
</style>
