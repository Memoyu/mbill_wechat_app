<script setup lang="ts">
import { useBillStore } from '@/store'
import { formatFloat } from '@/utils'
import { getBillColor } from '@/utils/bill'
import { getDateFormat, getWeekday } from '@/utils/date'

const billStore = useBillStore()

const billGroups = computed(() => {
  return billStore.bills
})
</script>

<template>
  <view class="p-3">
    <view v-for="g in billGroups" :key="g.date" class="mt-5">
      <view class="flex items-center justify-between">
        <view class="flex">
          <view class="font-bold">
            {{ getDateFormat(g.date) }}
          </view>
          <view class="ml-2 text-gray">
            {{ getWeekday(g.date) }}
          </view>
        </view>
        <view class="flex items-center gap-3 text-sm">
          <view>
            <text>
              收入
            </text>
            <text class="ml-1" :style="{ color: getBillColor(1) }">
              {{ formatFloat(g.income) }}
            </text>
          </view>

          <view>
            <text>
              支出
            </text>
            <text class="ml-1" :style="{ color: getBillColor(0) }">
              {{ formatFloat(g.expend) }}
            </text>
          </view>
        </view>
      </view>
      <view class="mt-2 rounded-lg bg-gray-100/60 px-3">
        <view v-for="b in g.items" :key="b.billId" class="py-3">
          <bill-item :bill="b" />
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
</style>
