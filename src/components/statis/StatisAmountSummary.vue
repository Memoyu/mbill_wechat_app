<script setup lang="ts">
import type { IBillSummaryAmountItem } from '@/api/types/bill'
import { getBillColor } from '@/utils'

const props = defineProps<{
  summary: IBillSummaryAmountItem
}>()
</script>

<template>
  <view class="grid grid-cols-3 gap-4">
    <view class="flex flex-col text-center">
      <text>月支出</text>
      <wd-text :text="summary.expend" mode="price" :color="getBillColor(0)" bold />
    </view>

    <view class="flex flex-col text-center">
      <text>月收入</text>
      <wd-text :text="summary.income" mode="price" :color="getBillColor(1)" bold />
    </view>

    <view class="flex flex-col text-center">
      <text>月结余</text>
      <wd-text :text="summary.surplus" mode="price" bold color="var(--mbill-surplus-color)" />
    </view>
  </view>

  <view class="grid grid-cols-3 mt-3 gap-4">
    <view class="flex flex-col text-center">
      <text>日均支出</text>
      <wd-text :text="summary.expendAvg" mode="price" :color="getBillColor(0)" bold />
    </view>

    <view class="flex flex-col text-center">
      <text>日均收入</text>
      <wd-text :text="summary.incomeAvg" mode="price" :color="getBillColor(1)" bold />
    </view>

    <view class="flex flex-col text-center">
      <text>日均结余</text>
      <wd-text :text="summary.surplusAvg" mode="price" bold color="var(--mbill-surplus-color)" />
    </view>
  </view>

  <view class="grid grid-cols-4 mt-3 gap-4">
    <view class="flex flex-col text-center">
      <text>最高支出</text>
      <wd-text :text="summary.expendHighest" mode="price" :color="getBillColor(0)" bold />
    </view>

    <view class="flex flex-col text-center">
      <text>最高收入</text>
      <wd-text :text="summary.incomeHighest" mode="price" :color="getBillColor(1)" bold />
    </view>

    <view class="flex flex-col text-center">
      <text>最低支出</text>
      <wd-text :text="summary.expendLowst" mode="price" :color="getBillColor(0)" bold />
    </view>

    <view class="flex flex-col text-center">
      <text>最低收入</text>
      <wd-text :text="summary.incomeLowst" mode="price" :color="getBillColor(1)" bold />
    </view>
  </view>
</template>

<style lang="scss" scoped>
</style>
