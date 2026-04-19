<script lang="ts" setup>
import dayjs from 'dayjs'

definePage({
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '账单日历',
  },
})

const show = ref(false)
const isDateSelectShow = ref(false)
const date = ref(Date.now())

const dateText = computed(() => {
  return dayjs(date.value).format('YYYY年MM月')
})

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
  <nav-bar>
    <template #title>
      <view class="w-full flex items-center justify-between">
        <view class="flex items-center" @tap="isDateSelectShow = true">
          <text class="mr-2">
            {{ dateText }}
          </text>
          <wd-icon name="arrow-down" />
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
  <view class="mx-3 mt-3 rounded-3xl bg-white/70 px-3">
    <calendar v-model="date" @change="handleMonthChange" />
  </view>
  <view class="w-full">
    <bill-list />
  </view>

  <!-- 日期选择弹窗 -->
  <date-popup v-model="isDateSelectShow" v-model:date="date" type="year-month" />
</template>

<style lang="scss" scoped>
//
</style>
