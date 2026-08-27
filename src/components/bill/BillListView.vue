<script setup lang="ts">
import type { IBillDateGroup } from '@/api/types/bill'
import { formatDate, formatFloat, getBillColor, weekDate } from '@/utils'

defineOptions({
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared',
  },
})

const props = defineProps<{
  groups: IBillDateGroup[]
  fixedDateFormat?: boolean
}>()
</script>

<template>
  <view class="p-3">
    <view v-for="g in groups" :key="g.date" class="mt-5">
      <view class="flex items-center justify-between">
        <view class="flex">
          <view class="font-bold">
            {{ formatDate(g.date, fixedDateFormat) }}
          </view>
          <view class="ml-2 text-gray">
            {{ weekDate(g.date) }}
          </view>
        </view>
        <view class="flex items-center gap-3 text-sm">
          <view class="flex gap-1">
            <text>支出</text>
            <text class="font-semibold" :style="{ color: getBillColor(0) }">
              {{ formatFloat(g.expend) }}
            </text>
          </view>

          <view class="flex gap-1">
            <text>收入</text>
            <text class="font-semibold" :style="{ color: getBillColor(1) }">
              {{ formatFloat(g.income) }}
            </text>
          </view>
        </view>
      </view>
      <view class="mt-2 flex flex-col gap-2 list-item-box rounded-lg">
        <view v-for="b in g.items" :key="b.billId">
          <bill-item :bill="b" />
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
</style>
