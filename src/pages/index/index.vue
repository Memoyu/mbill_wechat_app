<script lang="ts" setup>
import type { INotice } from '@/api/types/notice'
import dayjs from 'dayjs'
import { getNoticeList } from '@/api/notice'
import { useIndexBillStore, useLedgerPickerStore, useStartupStore, useUserStore } from '@/store'
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
const startupStore = useStartupStore()

const userShow = ref(false)
const ledgersShow = ref(false)
const settingsShow = ref(false)
const noticeShow = ref(false)
const dateSelectShow = ref(false)
const chartSettingShow = ref(false)
const paging = ref()

const notices = ref<INotice[]>([])

const user = computed(() => userStore.state.userInfo)
const hasNotice = computed(() => {
  const readSet = new Set(userStore.state.notices)
  return notices.value.some(n => !readSet.has(n.id))
})
const dateText = computed(() => {
  const date = dayjs(indexBillStore.date)
  let text = date.format('YYYY年MM月')
  if (indexBillStore.dateType === 'year') {
    text = date.format('YYYY年')
  }
  else if (indexBillStore.dateType === 'date') {
    text = date.format('YYYY年MM月DD日')
  }
  return text
})

onLoad(() => {
  console.log('Index onLoad')
  // 本地缓存数据变更时回调
  indexBillStore.localChangeCallback = (items, noMore) => {
    paging.value.completeByNoMore(items, noMore)
  }
})

// 监听账本选中
watch (() => ledgerPickerStore.selecteds, () => {
  // paging.value.reload()
}, { deep: true })

// 启动页完成后加载数据
watch(() => startupStore.loading, (loading) => {
  if (!loading) {
    console.log('Index startup done, loading data')
    // 加载数据
    paging.value.reload()
    indexBillStore.loadYearSummary()
    // 公告列表
    getNoticeList().then((res) => {
      notices.value = res
    })
  }
}, { immediate: true })

function handleDateChange(e: any) {
  indexBillStore.setDate(e)
  paging.value.reload()
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
  // console.log('handleQuery page', page)
  indexBillStore.loadBills(page).then((res) => {
    // console.log('complete')
    paging.value.completeByNoMore(res.items, res.noMore)
  }).catch((res) => {
    // console.log('handleQuery error', res)
    paging.value.complete(false)
  })
}
</script>

<template>
  <!-- 处理滚动穿透 -->
  <page-meta :page-style="`overflow:${ledgersShow || userShow || settingsShow || chartSettingShow || dateSelectShow ? 'hidden' : 'visible'};`" />
  <draw-background1 />

  <z-paging ref="paging" v-model="indexBillStore.groups" :auto="false" :default-page-size="15" @query="handleQuery">
    <template #top>
      <!-- 顶部操作 -->
      <view class="z-5 w-screen bg-[var(--wot-filled-zero)] pb-2 backdrop-blur-sm" :style="{ paddingTop: `${Math.max(safeAreaInsets.top, 28)}px` }">
        <view class="flex items-center gap-2 px-2">
          <!-- 用户信息按钮 -->
          <view
            class="sticky-item p-1"
            hover-class="sticky-item-hover"
            :hover-start-time="0"
            :hover-stay-time="200"
            @tap="userShow = true"
          >
            <wd-avatar :size="40" :src="user.avatar" />
          </view>

          <!-- 设置按钮 -->
          <view
            class="sticky-item p-2 px-3"
            hover-class="sticky-item-hover"
            :hover-start-time="0"
            :hover-stay-time="200"
            @tap="settingsShow = true"
          >
            <text class="i-lucide-settings text-sm" />
            <text class="whitespace-nowrap text-xs">设置</text>
          </view>

          <!-- 通知 -->
          <wd-badge custom-class="badge" is-dot :hidden="!hasNotice" right="5" top="5">
            <view
              class="sticky-item p-2"
              hover-class="sticky-item-hover"
              :hover-start-time="0"
              :hover-stay-time="200"
              @tap="noticeShow = true"
            >
              <text class="i-lucide-bell text-sm" />
            </view>
          </wd-badge>
        </view>
      </view>
    </template>

    <view class="w-screen flex flex-col gap-3 pt-3">
      <!-- 日期栏 -->
      <view class="flex items-center justify-between px-5">
        <view class="flex items-center" @tap="dateSelectShow = true">
          <text class="mr-1 font-bold">{{ dateText }}</text>
          <wd-icon size="16" name="caret-down" />
        </view>
        <action-btn @tap="handleCalendarClick">
          <text class="i-lucide-calendar-1" />
        </action-btn>
      </view>

      <!-- 账单金额汇总 -->
      <view class="bg-primary-1 mx-3 rounded-lg p-3">
        <amount-summary />
      </view>

      <!-- 账单金额汇总统计 -->
      <view v-if="indexBillStore.showChart" class="bg-primary-1 mx-3 rounded-lg px-2 py-3">
        <summary-charts @more="chartSettingShow = true" />
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
  </z-paging>

  <!-- 日期选择弹窗 -->
  <date-picker v-model="dateSelectShow" choose-type :date="indexBillStore.date" :type="indexBillStore.dateType" @change="handleDateChange" />

  <!-- 账本弹窗 -->
  <ledger-picker v-model="ledgersShow" />

  <!-- 用户弹窗 -->
  <user-popup v-model="userShow" />

  <!-- 设置弹窗 -->
  <setting-popup v-model="settingsShow" />

  <!-- 通知 -->
  <notice-popup v-model="noticeShow" :notices="notices" />

  <!-- 账单金额汇总统计设置 -->
  <summary-chart-setting v-model="chartSettingShow" />

  <!-- 底部导航栏 -->
  <bottom-nav-bar @show-ledgers="ledgersShow = true" />
</template>

<style lang="scss" scoped>
.sticky-item {
  @apply: w-fit flex items-center gap-1.5  rounded-full bg-gray-100/80 text-gray-600 backdrop-blur-sm transition-all;
}
.sticky-item-hover {
  @apply: bg-gray-50 !scale-97 transform-origin-center;
}
</style>
