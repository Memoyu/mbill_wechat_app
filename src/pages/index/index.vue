<script lang="ts" setup>
import dayjs from 'dayjs'
import { useIndexBillStore, useLedgerPickerStore, useUserStore } from '@/store'
import { safeAreaInsets } from '@/utils'

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
})

const userStore = useUserStore()
const indexBillStore = useIndexBillStore()
const ledgerPickerStore = useLedgerPickerStore()

const isUserShow = ref(false)
const isLedgersShow = ref(false)
const isSettingsShow = ref(false)
const isDateSelectShow = ref(false)
const paging = ref()

const user = computed(() => userStore.userInfo)

const dateText = computed(() => {
  const date = dayjs(indexBillStore.date.value)
  let text = date.format('YYYY年MM月')
  if (indexBillStore.date.type === 'year') {
    text = date.format('YYYY年')
  }
  else if (indexBillStore.date.type === 'date') {
    text = date.format('YYYY年MM月DD日')
  }
  return text
})

// 监听账本选中
watch (() => ledgerPickerStore.selectedLedgers, () => {
  paging.value.reload()
}, { deep: true })

onLoad(() => {
  indexBillStore.loadIndexSummary()
  indexBillStore.loadYearSummary()
})

function handleDateChange(e: any) {
  indexBillStore.setDate(e)
  paging.value.reload()
  indexBillStore.loadIndexSummary()
}

function handleCalendarClick() {
  uni.navigateTo({
    url: '/pages/calendar/index',
  })
}

/**
 * z-paging 查询
 */
function handleQuery(page: number) {
  console.log('handleQuery page', page)
  indexBillStore.loadBills(page).then((res) => {
    console.log('complete')
    paging.value.completeByNoMore(res.items, res.noMore)
  }).catch((res) => {
    paging.value.complete(false)
  })
}
</script>

<template>
  <!-- 处理滚动穿透 -->
  <page-meta :page-style="`overflow:${isLedgersShow || isUserShow || isSettingsShow || isDateSelectShow ? 'hidden' : 'visible'};`" />
  <draw-background1 />
  <z-paging ref="paging" v-model="indexBillStore.groups" :default-page-size="15" @query="handleQuery">
    <template #top>
      <!-- 顶部操作 -->
      <!-- <view
        class="sticky left-0 top-0 z-5 w-screen bg-white/70 pb-2 backdrop-blur-md"
        :style="{ paddingTop: `${Math.max(safeAreaInsets.top, 28)}px` }"
      > -->
      <view class="z-5 w-screen bg-white/70 pb-2 backdrop-blur-md" :style="{ paddingTop: `${Math.max(safeAreaInsets.top, 28)}px` }">
        <view class="flex items-center gap-2 px-2">
          <!-- 用户信息按钮 -->
          <view
            class="sticky-item p-1"
            hover-class="sticky-item-hover"
            :hover-start-time="0"
            :hover-stay-time="200"
            @tap="isUserShow = true"
          >
            <wd-avatar :size="40" :src="user.avatar" />
          </view>

          <!-- 设置按钮 -->
          <view
            class="sticky-item p-2 px-3"
            hover-class="bg-gray-50 !scale-97 transform-origin-center"
            :hover-start-time="0"
            :hover-stay-time="200"
            @tap="isSettingsShow = true"
          >
            <text class="i-carbon-settings text-sm" />
            <text class="whitespace-nowrap text-xs">设置</text>
          </view>

          <!-- 天气信息 -->
          <view
            class="sticky-item p-2 px-3"
            hover-class="bg-gray-50 !scale-97 transform-origin-center"
            :hover-start-time="0"
            :hover-stay-time="200"
          >
            <text class="iconfont icon-qing text-sm" />
            <text class="whitespace-nowrap text-xs">晴</text>
          </view>
        </view>
      </view>
    </template>

    <view class="w-screen flex flex-col gap-3">
      <!-- 日期栏 -->
      <view class="flex justify-between px-5">
        <view class="flex items-center" @tap="isDateSelectShow = true">
          <view class="mr-1 font-bold">
            {{ dateText }}
          </view>
          <wd-icon size="16" name="caret-down" />
        </view>
        <view class="iconfont icon-calendar text-2xl" @tap="handleCalendarClick" />
      </view>

      <!-- 账单金额汇总 -->
      <view class="mx-3 rounded-xl bg-indigo-300/20 p-3">
        <amount-summary />
      </view>

      <!-- 账单金额汇总统计 -->
      <view v-if="dayjs(indexBillStore.date.value).isSame(dayjs(), 'month')" class="mx-3 rounded-xl bg-indigo-300/20 px-2 py-3">
        <amount-summary-charts />
      </view>
    </view>

    <!-- 账单列表 -->
    <bill-list-view :groups="indexBillStore.groups" />

    <template #loadingMoreNoMore>
      <view class="pb-3">
        <view class="text-center text-sm text-gray-500">
          没有更多了
        </view>
        <!-- 底部安全区(因为没有使用layout) -->
        <wd-gap height="calc(32px + var(--wot-tabbar-height, 50px))" />
      </view>
    </template>

    <!-- 底部导航栏 -->
    <bottom-nav-bar @show-ledgers="isLedgersShow = true" />

    <!-- 日期选择弹窗 -->
    <date-picker v-model="isDateSelectShow" choose-type :date="indexBillStore.date" @change="handleDateChange" />

    <!-- 账本弹窗 -->
    <ledger-picker v-model="isLedgersShow" />

    <!-- 用户弹窗 -->
    <user-popup v-model="isUserShow" />
    <!-- 设置弹窗 -->
    <setting-popup v-model="isSettingsShow" />
  </z-paging>
</template>

<style lang="scss" scoped>
.sticky-item {
  @apply: w-fit flex items-center gap-1.5  rounded-full bg-gray-100/80 text-gray-600 backdrop-blur-sm transition-all;
}
.sticky-item-hover {
  @apply: bg-gray-200/80 !scale-97 transform-origin-center;
}
</style>
