<script setup lang="ts">
import type { IBillSummaryAmountItem } from '@/api/types/bill'
import dayjs from 'dayjs'
import { summaryAmountBill } from '@/api/bill'
import { formatFloat } from '@/utils'
import { getBillColor } from '@/utils/bill'

const props = defineProps<{
  date: number
}>()

const summary = ref<IBillSummaryAmountItem>({
  income: 0,
  expend: 0,
  incomeAvg: 0,
  expendAvg: 0,
  surplus: 0,
  expendHighest: 0,
  expendLowst: 0,
  incomeHighest: 0,
  incomeLowst: 0,
})

watch(() => props.date, (date) => {
  // 重新加载数据
  getAmountSummary(date)
}, { immediate: true })

function getAmountSummary(date: number) {
  summaryAmountBill({
    beginDate: dayjs(date).startOf('month').format(),
    endDate: dayjs(date).endOf('month').format(),
    series: 0,
  }).then((res) => {
    summary.value = res.summary
  })
}
</script>

<template>
  <view class="flex justify-between text-gray-500">
    <view class="flex flex-col gap-7">
      <view class="flex flex-col">
        <text>结余</text>
        <view class="text-xl text-indigo font-bold">
          {{ formatFloat(summary.surplus) }}
        </view>
      </view>

      <!-- 总金额 -->
      <view class="flex gap-3">
        <view class="flex gap-1">
          <text>支出</text>
          <text class="font-bold" :style="{ color: getBillColor(0) }">
            {{ formatFloat(summary.expend) }}
          </text>
        </view>
        <view class="flex gap-1">
          <text>收入</text>
          <text class="font-bold" :style="{ color: getBillColor(1) }">
            {{ formatFloat(summary.income) }}
          </text>
        </view>
      </view>
    </view>

    <!-- 最高、日均 -->
    <view class="flex flex-col justify-end gap-3">
      <view class="flex gap-1">
        <text>日均支出</text>
        <text class="font-bold" :style="{ color: getBillColor(0) }">
          {{ formatFloat(summary.expendAvg) }}
        </text>
      </view>
      <view class="flex gap-1">
        <text>最高支出</text>
        <text class="font-bold" :style="{ color: getBillColor(0) }">
          {{ formatFloat(summary.expendHighest) }}
        </text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
</style>
