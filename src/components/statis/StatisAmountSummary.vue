<script setup lang="ts">
import type { IBillSummaryAmountItem } from '@/api/types/bill'
import { getBillColor } from '@/utils'

const props = defineProps<{
  data: IBillSummaryAmountItem
}>()
</script>

<template>
  <view class="grid grid-cols-3 gap-4">
    <view class="flex flex-col text-center">
      <text>月支出</text>
      <wd-text :text="data.expend" mode="price" :color="getBillColor(0)" bold />
    </view>

    <view class="flex flex-col text-center">
      <text>月收入</text>
      <wd-text :text="data.income" mode="price" :color="getBillColor(1)" bold />
    </view>

    <view class="flex flex-col text-center">
      <text>月结余</text>
      <wd-text :text="data.surplus" mode="price" bold color="var(--mbill-surplus-color)" />
    </view>
  </view>

  <view class="grid grid-cols-3 mt-3 gap-4">
    <view class="flex flex-col text-center">
      <text>日均支出</text>
      <wd-text :text="data.expendAvg" mode="price" :color="getBillColor(0)" bold />
    </view>

    <view class="flex flex-col text-center">
      <text>日均收入</text>
      <wd-text :text="data.incomeAvg" mode="price" :color="getBillColor(1)" bold />
    </view>

    <view class="flex flex-col text-center">
      <text>日均结余</text>
      <wd-text :text="data.surplusAvg" mode="price" bold color="var(--mbill-surplus-color)" />
    </view>
  </view>

  <view class="grid grid-cols-4 mt-3 gap-4">
    <view class="flex flex-col text-center">
      <text>最高支出</text>
      <wd-text :text="data.expendHighest" mode="price" :color="getBillColor(0)" bold />
    </view>

    <view class="flex flex-col text-center">
      <text>最高收入</text>
      <wd-text :text="data.incomeHighest" mode="price" :color="getBillColor(1)" bold />
    </view>

    <view class="flex flex-col text-center">
      <text>最低支出</text>
      <wd-text :text="data.expendLowst" mode="price" :color="getBillColor(0)" bold />
    </view>

    <view class="flex flex-col text-center">
      <text>最低收入</text>
      <wd-text :text="data.incomeLowst" mode="price" :color="getBillColor(1)" bold />
    </view>
  </view>
</template>

<style lang="scss" scoped>
</style>
