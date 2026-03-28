<script lang="ts" setup>
import dayjs from 'dayjs'
import { safeAreaInsets } from '@/utils/systemInfo'

defineOptions({
  name: 'Home',
})
definePage({
  // 使用 type: "home" 属性设置首页，其他页面不需要设置，默认为page
  type: 'home',
  style: {
    // 'custom' 表示开启自定义导航栏，默认 'default'
    navigationStyle: 'custom',
    navigationBarTitleText: '首页',
  },
  layout: false, // 当前页面不适用layout
})

const date = ref(Date.now())
const avatarUrl = 'https://wot-ui.cn/assets/panda.jpg'
const ledger = ref('2323234341')
const ledgerName = ref('日常账本字符222222233333333')
const isUserShow = ref(false)
const isLedgersShow = ref(false)
const isSettingsShow = ref(false)
const isDateSelectShow = ref(false)

const dateText = computed(() => {
  return dayjs(date.value).format('YYYY年MM月')
})

onLoad(() => {
})

function handleLedgerChange(item) {
  ledgerName.value = item.name
}

function handleCalendarClick() {
  uni.navigateTo({
    url: '/pages/calendar/index',
  })
}
</script>

<template>
  <!-- 处理滚动穿透 -->
  <page-meta :page-style="`overflow:${isLedgersShow || isDateSelectShow || isUserShow || isSettingsShow ? 'hidden' : 'visible'};`" />
  <draw-background1 />

  <!-- 顶部操作 -->
  <view
    class="sticky left-0 top-0 z-5 w-screen bg-white/70 backdrop-blur-md"
    :style="{ paddingTop: `${Math.max(safeAreaInsets.top, 28)}px` }"
  >
    <view class="flex items-center gap-2 px-2">
      <!-- 用户信息按钮 -->
      <view
        class="sticky-item p-1"
        hover-class="sticky-item-hover"
        :hover-start-time="0"
        :hover-stay-time="200"
        @tap="isUserShow = true"
      >
        <wd-avatar :size="40" :src="avatarUrl" />
      </view>

      <!-- 账本按钮 -->
      <view
        class="sticky-item ledger-sticky-item p-2 px-3"
        hover-class="sticky-item-hover"
        :hover-start-time="0"
        :hover-stay-time="200"
        @tap="isLedgersShow = true"
      >
        <wd-icon class="flex-shrink-0 text-sm" name="arrow-down" />
        <text class="truncate text-sm">{{ ledgerName }}</text>
      </view>

      <!-- 设置按钮 -->
      <view
        class="sticky-item p-2 px-3"
        hover-class="bg-gray-200/80 !scale-97 transform-origin-center"
        :hover-start-time="0"
        :hover-stay-time="200"
        @tap="isSettingsShow = true"
      >
        <text class="i-carbon-settings text-sm" />
        <text class="whitespace-nowrap text-sm">设置</text>
      </view>
    </view>
  </view>

  <!-- 账单月汇总 -->
  <view class="mt-3 w-screen">
    <view class="mx-3 rounded-xl bg-indigo-300/20 px-2 py-3">
      <view class="mb-2 flex justify-between">
        <view class="flex items-center">
          <view class="mr-1 font-bold" @click="() => isDateSelectShow = true">
            {{ dateText }}
          </view>
          <wd-icon size="16" name="arrow-down" />
        </view>
        <view class="iconfont icon-calendar text-2xl" @click="handleCalendarClick" />
      </view>
      <view class="h-55x mt-3 flex justify-between">
        <view class="flex flex-col items-center justify-between">
          <view class="text-gray-500">
            本月结余
          </view>
          <view class="ml-1 text-xl text-green font-bold">
            10,000,000
          </view>
        </view>
        <view class="flex flex-col justify-between">
          <view class="flex">
            <view class="text-gray-500">
              本月收入
            </view>
            <view class="ml-1 text-red font-bold">
              1100
            </view>
          </view>
          <view class="flex">
            <view class="text-gray-500">
              本月支出
            </view>
            <view class="ml-1 text-green font-bold">
              1000
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>

  <!-- 账单周期汇总 -->
  <view class="mt-3 w-screen">
    <view class="mx-3 rounded-xl bg-indigo-300/20 px-2 py-3">
      <date-range-summary />
    </view>
  </view>

  <!-- 账单列表 -->
  <view>
    <bill-list />
  </view>

  <!-- 底部安全区(因为没有使用layout) -->
  <wd-gap height="calc(32px + var(--wot-tabbar-height, 50px))" />

  <!-- 日期选择弹窗 -->
  <date-time-popup v-model="isDateSelectShow" v-model:date="date" type="year-month" />
  <!-- 账本弹窗 -->
  <ledger-popup v-model="isLedgersShow" v-model:value="ledger" @change="handleLedgerChange" />
  <!-- 用户弹窗 -->
  <user-popup v-model="isUserShow" />
  <!-- 设置弹窗 -->
  <setting-popup v-model="isSettingsShow" />
</template>

<style lang="scss" scoped>
.sticky-item {
  @apply: w-fit flex items-center gap-1.5  rounded-full bg-gray-100/80 text-gray-600 backdrop-blur-sm transition-all;
}
.sticky-item-hover {
  @apply: bg-gray-200/80 !scale-97 transform-origin-center;
}

.ledger-sticky-item {
  width: calc(80% - 190px);
}
</style>
