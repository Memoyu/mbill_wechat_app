<script lang="ts" setup>
import { useLedgerStore } from '@/store'
import { systemInfo } from '@/utils/systemInfo'

definePage({
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '账本管理',
  },
})
const ledgerStore = useLedgerStore()
const ledgers = ref(ledgerStore.ledgers)

const show = ref(false)
const scrollHeight = ref(300)

onMounted(() => {
  nextTick(() => {
    uni.createSelectorQuery().select('#LEDGER_NAVBAR').boundingClientRect((data: UniApp.NodeInfo) => {
      // console.log(data)
      scrollHeight.value = systemInfo.windowHeight - (data.height + 16) // 16为外层view的padding
    }).exec()
  })
})

function handleScanClick() {

}

function handleSortChange(list) {
  console.log(list, '重新排序')
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
    <view class="px-3 py-2">
      <drag-sort-list-view :list="ledgers" :gap="8" key-prop="ledgerId" :height="scrollHeight" @change="handleSortChange">
        <template #content="{ listItem }">
          <view class="ledger-item-box">
            <view class="ledger-item-content">
              <text class="line-clamp-1 font-semibold">{{ listItem.name }}</text>
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
                <text>共{{ listItem.count }}条账单</text>
                <text>创建于{{ listItem.createTime }}</text>
              </view>
            </view>
            <view class="ledger-item-more">
              <view class="flex items-center justify-center rounded-full bg-white p-1">
                <wd-icon name="ellipsis" size="18" />
              </view>
            </view>
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

.ledger-item-box {
  display: flex;
  border-radius: 19px;
  box-sizing: border-box;
  padding: 0.5rem 0;
  // border-bottom: 1px solid #f0f0f0;
}

.ledger-item-content {
  margin-left: 0.9rem;
  flex: 1;
  width: calc(100% - 48px);
  display: flex;
  flex-direction: column;
}
.ledger-item-more {
  display: flex;
  flex-direction: column;
  justify-content: start;
  height: 100%;
  flex-shrink: 0;
  color: #999;
  padding: 0 0.9rem;
}
</style>
