<script lang="ts" setup>
import lodash from 'lodash'
import { useLedgerStore } from '@/store'

definePage({
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '账本管理',
  },
})
const ledgerStore = useLedgerStore()

const show = ref(false)
const sorting = ref(false)
const ledgerWithPos = ref([])
const scrollTop = ref(0)
const targetIndex = ref(-1)
const currentIndex = ref(-1)
const oldIndex = ref(-1)
const maxItems = 13

const itemHeight = computed(() => 85)

function initPosition(arr: any[]) {
  return arr.map((item, index) => {
    return {
      ...item,
      y: index * itemHeight.value,
      x: 0,
    }
  })
}

onMounted(() => {
  scrollTop.value = 0
  ledgerWithPos.value = lodash.cloneDeep(initPosition(ledgerStore.ledgers))
})

function scrollList() {
  const middleIndex = (maxItems - 1) / 2
  if (targetIndex.value > middleIndex) {
    scrollTop.value = (targetIndex.value - middleIndex) * itemHeight.value
  }
  else {
    scrollTop.value = 0.1
    nextTick(() => {
      scrollTop.value = 0
    })
  }
}

function handleScanClick() {

}

function handleDragStart(index) {
  currentIndex.value = index
  oldIndex.value = index
  sorting.value = true
}

function handleDragEnd() {
  if (!sorting.value)
    return
  sorting.value = false
  ledgerWithPos.value[oldIndex.value].y = targetIndex.value * itemHeight.value
  ledgerWithPos.value = initPosition(ledgerWithPos.value.sort((item1, item2) => item1.y - item2.y))
  oldIndex.value = -1
  currentIndex.value = -1
  targetIndex.value = -1
}

function handleSortChange(e: any) {
  if (e.detail.source !== 'touch' || !sorting.value) {
    return
  }

  // console.log(e.detail)
  const { y } = e.detail
  const currentY = Math.floor((y + itemHeight.value / 2) / itemHeight.value)
  targetIndex.value = Math.min(currentY, ledgerWithPos.value.length - 1)

  if (targetIndex.value !== currentIndex.value && targetIndex.value >= 0) {
    const newList = lodash.cloneDeep(ledgerWithPos.value)
    const elementToMove = newList.splice(oldIndex.value, 1)[0]
    newList.splice(targetIndex.value, 0, elementToMove)
    scrollList()

    ledgerWithPos.value.forEach((item, index) => {
      // 当前项通过手动拖动已经到了指定位置，因此需要重新排序其他项的高度
      if (index !== oldIndex.value) {
        // 找到所有项在新数组中的位置
        const newItemIndex = newList.findIndex(newItem => newItem.ledgerId === item.ledgerId)
        // 根据新数组的位置重新置y值
        item.y = newItemIndex * itemHeight.value
        // console.log(item.y)
      }
    })

    nextTick(() => {
      currentIndex.value = targetIndex.value
    })
  }
}
</script>

<template>
  <page-meta :page-style="`overflow:${show ? 'hidden' : 'visible'};`" />
  <draw-background2 />
  <nav-bar>
    <template #title>
      <text> 账本管理 </text>
    </template>
    <template #action>
      <view class="flex items-center gap-3">
        <view class="action-icon-box" @tap="handleScanClick">
          <text class="iconfont icon-plus title-icon" />
          <text class="ml-2 text-xs">创建</text>
        </view>
        <view class="action-icon-box" @tap="handleScanClick">
          <text class="iconfont icon-scan title-icon" />
          <text class="ml-2 text-xs">扫码</text>
        </view>
      </view>
    </template>
  </nav-bar>

  <view class="w-screen">
    <view class="p-2">
      <scroll-view
        scroll-y
        class="relative flex-1"
        :scroll-top="scrollTop"
        scroll-with-animation
        :enhanced="true"
      >
        <movable-area
          class="ledger-movable-area"
          :style="{
            height: `${ledgerWithPos.length * itemHeight}px`,
          }"
        >
          <movable-view
            v-for="(item, index) in ledgerWithPos"
            :key="item.ledgerId"
            class="ledger-movable-item"
            :style="{
              height: `${itemHeight}px`,
              zIndex: oldIndex === index ? 10 : 1,
            }"
            :x="item.x"
            :y="`${item.y}px`"
            direction="vertical"
            out-of-bounds
            :disabled="!sorting"
            @change="handleSortChange"
          >
            <view class="ledger-item-box bg-gray-200" :class="{ 'ledger-item-box--active': oldIndex === index }" :style="{ height: `${itemHeight - 6}px` }">
              <view
                class="ledger-drag-handle"
                @touchend="handleDragEnd"
                @touchstart="handleDragStart(index)"
              >
                <text class="i-carbon-draggable" />
              </view>

              <view class="ledger-content">
                <text class="line-clamp-1 font-semibold">{{ item.name }}</text>
                <view class="mt-2 flex items-center text-xs">
                  <text>
                    收入
                  </text>
                  <text class="ml-2 text-emerald font-bold">
                    2000000
                  </text>
                  <text class="ml-4">
                    支出
                  </text>
                  <text class="ml-2 text-rose font-bold">
                    2000000
                  </text>
                </view>
                <view class="mt-2 flex items-center text-xs">
                  <text>共{{ item.count }}条账单</text>
                  <text>创建于{{ item.createTime }}</text>
                </view>
              </view>
            </view>
          </movable-view>
        </movable-area>
      </scroll-view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.action-icon-box {
  @apply: flex items-center justify-center rounded-full bg-gray-50 p-2 px-4;
}

.ledger-movable-area {
  position: relative;
  width: 100%;
}

.ledger-movable-item {
  width: 100%;
  display: flex;
  align-items: center;
  transition: background-color 0.2s;
}

.ledger-item-box--active {
  background-color: white;
}

.ledger-item-box {
  border-radius: 19px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.5rem 0;
  margin: 0.5rem 0;
  // border-bottom: 1px solid #f0f0f0;
}

.ledger-drag-handle {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  margin-right: 0.5rem;
  font-size: 1.25rem;
  color: #999;
}

.ledger-content {
  flex: 1;
  width: calc(100% - 48px);
  display: flex;
  flex-direction: column;
}
</style>
