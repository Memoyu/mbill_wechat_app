<script lang="ts" setup>
import lodash from 'lodash'
import { useLedgerStore } from '@/store'
import { systemInfo } from '@/utils/systemInfo'

definePage({
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '账本管理',
  },
})
const ledgerStore = useLedgerStore()

const show = ref(false)
const sorting = ref(false)
const list = ref([])
const scrollTop = ref(0)
const targetIndex = ref(-1)
const currentIndex = ref(-1)
const oldIndex = ref(-1)
const maxItems = 7
const scrollHeight = ref(300)

const itemHeight = computed(() => 100)

function initPosition(arr: any[]) {
  list.value = lodash.cloneDeep(arr.map((item, index) => {
    return {
      ...item,
      y: index * itemHeight.value,
      x: 0,
    }
  }))
  // console.log(list.value)
}

onMounted(() => {
  nextTick(() => {
    uni.createSelectorQuery().select('#LEDGER_NAVBAR').boundingClientRect((data: UniApp.NodeInfo) => {
      // console.log(data)
      scrollHeight.value = systemInfo.windowHeight - (data.height + 16) // 16为外层view的padding
    }).exec()
  })

  scrollTop.value = 0
  initPosition(ledgerStore.ledgers)
})

function handleScanClick() {

}

function handleDragStart(index) {
  // console.log(index)
  currentIndex.value = index
  oldIndex.value = index
  sorting.value = true
}

function handleDragEnd() {
  if (!sorting.value)
    return
  sorting.value = false

  list.value[oldIndex.value].y = (targetIndex.value * itemHeight.value) + 0.001
  list.value[oldIndex.value].x = 0.001
  nextTick(() => {
    initPosition(list.value.sort((item1, item2) => item1.y - item2.y))
  })

  oldIndex.value = -1
  currentIndex.value = -1
  targetIndex.value = -1
}

function handleSortChange(e: any) {
  // console.log(e)
  if (e.detail.source !== 'touch' || !sorting.value) {
    return
  }

  const { y } = e.detail
  const currentY = Math.floor((y + itemHeight.value / 2) / itemHeight.value)
  targetIndex.value = Math.min(currentY, list.value.length - 1)
  // console.log(targetIndex.value, currentIndex.value)
  if (targetIndex.value !== currentIndex.value && targetIndex.value >= 0) {
    const newList = lodash.cloneDeep(list.value)
    const elementToMove = newList.splice(oldIndex.value, 1)[0]
    newList.splice(targetIndex.value, 0, elementToMove)
    scrollList()

    list.value.forEach((item, index) => {
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
  // console.log(scrollTop.value, 'scrollTop')
}
</script>

<template>
  <page-meta :page-style="`overflow:${show ? 'hidden' : 'visible'};`" />
  <draw-background2 />
  <nav-bar id="LEDGER_NAVBAR">
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
        class="relative"
        :scroll-top="scrollTop"
        scroll-with-animation
        :enhanced="true"
        :style="{ height: `${scrollHeight}px` }"
      >
        <movable-area
          class="ledger-movable-area"
          :style="{
            height: `${list.length * itemHeight}px`,
          }"
        >
          <movable-view
            v-for="(item, index) in list"
            :key="`${item.ledgerId}-${index}`"
            class="ledger-movable-item bg-gray-200"
            :class="{ 'ledger-movable-item--active': oldIndex === index }"
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
            <view :key="item.ledgerId" class="ledger-item-box">
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

              <view
                class="ledger-drag-handle"
                @touchstart="handleDragStart(index)"
                @touchend="handleDragEnd"
              >
                <text class="i-carbon-draggable" />
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

.ledger-movable-item--active {
  @apply: bg-indigo-400 dark:bg-indigo-600;
}

.ledger-item-box {
  border-radius: 19px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.5rem 0;
  // border-bottom: 1px solid #f0f0f0;
}

.ledger-drag-handle {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: #999;
  padding-right: 0.9rem;
}

.ledger-content {
  margin-left: 0.9rem;
  flex: 1;
  width: calc(100% - 48px);
  display: flex;
  flex-direction: column;
}
</style>
