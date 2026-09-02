<script lang="ts" setup>
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import { BillOptions } from '@/typings'
import { getBillColor, systemInfo } from '@/utils'

defineOptions({
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared',
  },
})
const props = defineProps<{
}>()
defineExpose({
  init,
})

const contentHeight = ref(0)
const options = ref()
const active = ref(0)
const statis = ref({
  monthlyIncome: 23004.56,
  monthlyExpend: 2304.56,
  monthlySurplus: 2334,
  dailyIncome: 3004.56,
  dailyExpend: 304.56,
  dailySurplus: 334,
})
const paging = ref()

const blockBillType = ref({
  trendType: 0,
})

function init(height: number) {
  contentHeight.value = height
  options.value = getMonths(dayjs(), 20)
}

function handleScrollToLower() {
  const last = options.value[options.value.length - 1]
  options.value.push(...getMonths(dayjs(last)))
}

function getMonths(date: Dayjs, count = 10) {
  const dates = Array.from({ length: count }, (_, i) => {
    return date.add(i, 'month').startOf('month').format('YYYY-MM')
  })
  // console.log(dates, '2222')
  return dates
}

function handleQuery() {
  // console.log('handleQuery')
  paging.value.complete()
}
</script>

<template>
  <view :style="{ height: `${contentHeight}px` }" class="w-full">
    <z-paging ref="paging" :fixed="false" refresher-only @query="handleQuery">
      <template #top>
        <view class="z-5 bg-white/70 pb-2 pt-3 backdrop-blur-md">
          <!-- 月份选择器 -->
          <view class="px-2">
            <mbill-segmented v-model="active" :options="options" @scrolltolower="handleScrollToLower">
              <template #content="{ option }">
                <view class="flex flex-col justify-center rounded-xl bg-indigo-500/40 px-3 py-4 text-white">
                  <view class="flex items-end">
                    <text class="text-base font-semibold">
                      {{ option.value.substring(5) }}
                    </text>
                    <text>月</text>
                  </view>
                  <text class="text-12px">{{ option.value.substring(0, 4) }}</text>
                </view>
              </template>
            </mbill-segmented>
          </view>
        </view>
      </template>

      <view class="mx-3">
        <!-- 汇总 -->
        <view class="mt-4 rounded-lg bg-indigo-300/70 p-2">
          <view class="grid grid-cols-3 gap-4">
            <view class="text-center">
              <text>月收入</text>
              <wd-text :text="statis.monthlyIncome" mode="price" :color="getBillColor(1)" bold />
            </view>

            <view class="text-center">
              <text>月支出</text>
              <wd-text :text="statis.monthlyExpend" mode="price" :color="getBillColor(0)" bold />
            </view>

            <view class="text-center">
              <text>月结余</text>
              <wd-text :text="statis.monthlySurplus" mode="price" bold />
            </view>
          </view>

          <view class="grid grid-cols-3 mt-3 gap-4">
            <view class="text-center">
              <text>日均收入</text>
              <wd-text :text="statis.dailyIncome" mode="price" :color="getBillColor(1)" bold />
            </view>

            <view class="text-center">
              <text>日均支出</text>
              <wd-text :text="statis.dailyExpend" mode="price" :color="getBillColor(0)" bold />
            </view>

            <view class="text-center">
              <text>日均结余</text>
              <wd-text :text="statis.dailySurplus" mode="price" bold />
            </view>
          </view>
        </view>

        <view class="mt-4 rounded-lg bg-indigo-300/70 p-2">
          <view class="flex items-center justify-between">
            <text class="font-semibold">
              收支统计
            </text>
            <view>
              <mbill-segmented v-model="blockBillType.trendType" :options="BillOptions" />
            </view>
          </view>
          <view class="h-35">
            趋势图
          </view>
        </view>

        <view class="mt-4 rounded-lg bg-indigo-300/70 p-2">
          <view class="flex items-center justify-between">
            <text class="font-semibold">分类数据</text>
            <view>
              <mbill-segmented v-model="blockBillType.trendType" :options="BillOptions" />
            </view>
          </view>
          <view class="h-35">
            占比图
          </view>
          <view class="h-35">
            数据条
          </view>
        </view>

        <view class="mt-4 rounded-lg bg-indigo-300/70 p-2">
          <view class="flex items-center justify-between">
            <text class="font-semibold">成员数据</text>
            <view>
              <mbill-segmented v-model="blockBillType.trendType" :options="BillOptions" />
            </view>
          </view>
          <view class="h-35">
            占比图
          </view>
          <view class="h-35">
            数据条
          </view>
        </view>

        <view class="mt-4 rounded-lg bg-indigo-300/70 p-2">
          <view class="flex items-center justify-between">
            <text class="font-semibold">标签数据</text>
            <view>
              <mbill-segmented v-model="blockBillType.trendType" :options="BillOptions" />
            </view>
          </view>
          <view class="h-35">
            占比图
          </view>
          <view class="h-35">
            数据条
          </view>
        </view>

        <view class="mt-4 rounded-lg bg-indigo-300/70 p-2">
          <view class="flex items-center justify-between">
            <text class="font-semibold">报表统计</text>
            <view>
              <mbill-segmented v-model="blockBillType.trendType" :options="BillOptions" />
            </view>
          </view>
          <view class="h-35">
            统计数据
          </view>
        </view>
      </view>
    </z-paging>
  </view>
</template>

<style lang="scss" scoped>
//
</style>
