<script lang="ts" setup>
import dayjs from 'dayjs'
import { systemInfo } from '@/utils/systemInfo'

definePage({
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '账单日历',
  },
})

const show = ref(false)
const isDateSelectShow = ref(false)
const calExpand = ref(true)
const date = ref(Date.now())
const navbarHeight = ref(0)
const calendarHeight = ref(0)

const { proxy } = getCurrentInstance() as any

const dateText = computed(() => {
  return dayjs(date.value).format('YYYY年MM月')
})

const scrollHeight = computed(() => {
  return systemInfo.windowHeight - navbarHeight.value - calendarHeight.value
})

onMounted(() => {
  getNavbarHeight()
})

function getNavbarHeight() {
  nextTick(() => {
    uni.createSelectorQuery().in(proxy).select('#TOP_NAVBAR').boundingClientRect((nav: any) => {
      // console.log(nav, 'TOP_NAVBAR')
      navbarHeight.value = nav?.height ?? 122
    }).exec()
  })
}

function handleCalHeightChange(height: number) {
  // console.log(height, 'handleCalHeightChange')
  calendarHeight.value = height + 16
}

function handleScroll(event: any) {
  // console.log(event.detail, 'handleScroll')

  if (event.detail.deltaY < -1) {
    calExpand.value = false
  }
}

function handleScrollToUpper() {
  calExpand.value = true
}

function handleTodayClick() {
  // 定位到今天
}

function handleMonthChange(month: number) {
  // console.log('月份切换', month)
}
</script>

<template>
  <page-meta :page-style="`overflow:${isDateSelectShow ? 'hidden' : 'visible'};`" />
  <draw-background2 />
  <!-- 导航栏 -->
  <nav-bar id="TOP_NAVBAR">
    <template #title>
      <view class="w-full flex items-center justify-between">
        <view class="flex items-center" @tap="isDateSelectShow = true">
          <text class="mr-2">
            {{ dateText }}
          </text>
          <wd-icon name="caret-down" />
        </view>
        <view class="iconfont icon-today text-xl" @click="handleTodayClick" />
      </view>
    </template>
    <template #action>
      <view class="mt-3 flex items-center gap-3 text-sm">
        <slot name="action" />
        <view class="flex">
          <view>
            收入
          </view>
          <view class="ml-1 text-emerald">
            2000000
          </view>
        </view>

        <view class="flex">
          <view>
            支出
          </view>
          <view class="ml-1 text-rose">
            2000000
          </view>
        </view>

        <view class="flex">
          <view>
            结余
          </view>
          <view class="ml-1 text-gray">
            2000000
          </view>
        </view>
      </view>
    </template>
  </nav-bar>
  <!-- 日历组件 -->
  <view id="CALENDAR" class="mx-3 rounded-3xl bg-white p-2">
    <calendar v-model="date" :expand="calExpand" @change="handleMonthChange" @heightchange="handleCalHeightChange" />
  </view>

  <scroll-view
    class="w-full"
    :style="{ height: `${scrollHeight}px` }"
    scroll-y
    :upper-threshold="30"
    @scroll="handleScroll"
    @scrolltoupper="handleScrollToUpper"
  >
    <bill-list-view />
  </scroll-view>

  <!-- 日期选择弹窗 -->
  <date-popup v-model="isDateSelectShow" v-model:date="date" type="year-month" />
</template>

<style lang="scss" scoped>
//
</style>
