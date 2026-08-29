<script setup lang="ts">
import { useIndexBillStore } from '@/store'
import { amountFormat, getBillColor } from '@/utils'

const props = defineProps<{
}>()

const indexBillStore = useIndexBillStore()

const summary = computed(() => indexBillStore.summary)
</script>

<template>
  <view class="flex justify-between text-gray-500">
    <view class="flex flex-col gap-7">
      <view class="flex flex-col">
        <text>结余</text>
        <view class="text-xl text-[var(--mbill-surplus-color)] font-bold">
          {{ amountFormat(summary.surplus) }}
        </view>
      </view>

      <!-- 总金额 -->
      <view class="flex gap-4">
        <view class="flex gap-1">
          <text>支</text>
          <text class="font-bold" :style="{ color: getBillColor(0) }">
            {{ amountFormat(summary.expend) }}
          </text>
        </view>
        <view class="flex gap-1">
          <text>收</text>
          <text class="font-bold" :style="{ color: getBillColor(1) }">
            {{ amountFormat(summary.income) }}
          </text>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
</style>
