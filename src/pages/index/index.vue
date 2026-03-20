<script lang="ts" setup>
import dayjs from 'dayjs'
import { getWeekLabel } from '@/utils/date'
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
})

const lockScroll = ref(false)
provide('lockScroll', {
  lockScroll,
  updateLockScroll: (newValue) => {
    lockScroll.value = newValue
  },
})

const avatarUrl = 'https://wot-ui.cn/assets/panda.jpg'
const ledgerName = ref('日常账本')
const isUserInfoShow = ref(false)
const isLedgersShow = ref(false)
const isSettingsShow = ref(false)
const isDateSelectShow = ref(false)
const dateValue = ref(Date.now())
const date = ref(1772294400000)
const swiperHeight = ref(290)
const swiperList = [
  '1772294400000',
  '1774972800000',
  '1777564800000',
]
const current = ref('1772294400000')

// 周标题
const weekLabel = computed(() => {
  return (index: number) => {
    return getWeekLabel(index - 1)
  }
})

const dateValueText = computed(() => {
  return dayjs(dateValue.value).format('YYYY年MM月')
})

onLoad(() => {
  console.log('测试 uni API 自动引入: onLoad')
})

onMounted(() => {
  console.log('测试 uni API 自动引入: onMounted')
  nextTick(() => getSwiperItemHeight(0))
})

function handleChangeDate(e) {
  // dateValue.value = e.value
}

function handleClickSwiper(item) {
  // console.log(item)
}

function handleChangeSwiper(e) {
  console.log(e, 'change')
  getSwiperItemHeight(e.current)
}

function getSwiperItemHeight(item) {
  const instance = getCurrentInstance()
  const query = uni.createSelectorQuery()

  query.selectAll(`.calendar-content`).boundingClientRect((data: any[]) => {
    // console.log(data, 'boundingClientRect') // 输出元素位置信息
    const content = data[item]
    swiperHeight.value = content?.height ?? 290
  }).exec()
}
</script>

<template>
  <page-meta :page-style="lockScroll ? 'overflow:hidden' : ''" />
  <draw-background1 />

  <!-- 顶部操作 -->
  <view
    class="sticky left-0 top-0 z-5 w-screen bg-white/70 backdrop-blur-md"
    :style="{
      paddingTop: `${Math.max(safeAreaInsets?.top, 28)}px`,
    }"
  >
    <view class="flex items-center gap-3 px-3">
      <!-- 用户信息按钮 -->
      <view
        class="sticky-item p-1"
        hover-class="sticky-item-hover"
        :hover-start-time="0"
        :hover-stay-time="200"
        @tap="isUserInfoShow = true"
      >
        <wd-avatar :size="40" :src="avatarUrl" />
      </view>

      <!-- 设置按钮 -->
      <view
        class="sticky-item p-2 px-3"
        hover-class="sticky-item-hover"
        :hover-start-time="0"
        :hover-stay-time="200"
        @tap="() => {
          isSettingsShow = true;
          console.log(dateValue);
        }"
      >
        <text class="i-carbon-settings text-sm" />
        <text class="whitespace-nowrap text-sm">设置</text>
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

  <!-- 日历头部 -->
  <view class="mx-5 flex items-center justify-between">
    <view>
      <view class="mb-2 font-bold" @click="() => isDateSelectShow = true">
        {{ dateValueText }}
      </view>
      <view class="flex space-x-5">
        <view class="flex">
          收<view class="ml-1 text-green">
            1100
          </view>
        </view>
        <view class="flex">
          支<view class="ml-1 text-red">
            1000
          </view>
        </view>
        <view class="flex">
          余<view class="ml-1">
            100
          </view>
        </view>
      </view>
      <date-time-popup v-model="isDateSelectShow" v-model:date="dateValue" type="year-month" />
    </view>
    <view class="iconfont icon-today text-30px" />
  </view>

  <!-- 日历组件 -->
  <view class="mx-3 mt-3 rounded-3xl bg-indigo-500/15">
    <view class="calendar-weeks">
      <view v-for="item in 7" :key="item" class="calendar-week">
        {{ weekLabel(item) }}
      </view>
    </view>

    <wd-swiper
      v-model="current"
      :height="swiperHeight"
      :autoplay="false"
      :indicator="false"
      :list="swiperList"
      @click="handleClickSwiper"
      @change="handleChangeSwiper"
    >
      <template #default="{ item }">
        <calendar v-model="dateValue" class="calendar-content" :date="Number(item)" @change="handleChangeDate" />
      </template>
    </wd-swiper>
  </view>
  <view class="mt-5 h-20 bg-indigo-300" />
</template>

<style lang="scss" scoped>
.sticky-item {
  @apply: w-fit flex items-center gap-1.5  rounded-full bg-gray-100/80 text-gray-600 backdrop-blur-sm transition-all;
}
.sticky-item-hover {
  @apply: bg-gray-200/80 !scale-97 transform-origin-center;
}
.calendar-weeks {
  display: flex;
  height: 36px;
  line-height: 36px;
  color: rgba(0, 0, 0, 0.85);
  font-size: 16px;
  font-weight: bold;
}

.calendar-week {
  flex: 1 1 0%;
  text-align: center;
}
</style>
