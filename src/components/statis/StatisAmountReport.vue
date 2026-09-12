<script setup lang="ts">
import type { IBillSummaryAmountItem } from '@/api/types/bill'
import dayjs from 'dayjs'
import { getBillColor } from '@/utils'

const props = defineProps<{
  dateType: 'date' | 'month'
  data: IBillSummaryAmountItem []
}>()
</script>

<template>
  <view class="mb-4 flex items-center justify-between">
    <text class="font-semibold">报表统计</text>
  </view>
  <view class="h-40 overflow-y-auto space-y-3">
    <view v-for="item in data.filter(s => s.expend > 0 || s.income > 0)" :key="item.date">
      <view class="grid grid-cols-4 flex-1 gap-4 text-center">
        <text>
          {{ dateType === 'date' ? dayjs(item.date).format('MM-DD') : (`${dayjs(item.date).month() + 1}月`) }}
        </text>

        <wd-text :text="item.expend" mode="price" :color="getBillColor(0)" />
        <wd-text :text="item.income" mode="price" :color="getBillColor(1)" />
        <wd-text :text="item.surplus" mode="price" :color="getBillColor(-1)" />
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
</style>
