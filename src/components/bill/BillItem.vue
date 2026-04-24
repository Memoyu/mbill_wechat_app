<script setup lang="ts">
import type { BillRes } from '@/api/types/bill'
import dayjs from 'dayjs'
import { formatFloat } from '@/utils'

const props = defineProps<{
  bill: BillRes
}>()

const categoryText = computed(() => {
  return props.bill.category.name ? props.bill.category.name.substring(0, 1) : ''
})
const categorySrc = computed(() => {
  return props.bill.category.icon ? props.bill.category.icon : ''
})

const amountColor = computed(() => {
  return props.bill.type === 0 ? 'rgb(251 113 133)' : 'rgb(52 211 153)'
})
</script>

<template>
  <view class="text-sm">
    <!-- 分类图标 -->
    <view class="flex items-center justify-between">
      <view class="flex items-center">
        <wd-avatar :text="categoryText" :src="categorySrc" size="30" />
        <text class="ml-2">{{ bill.category.name }}</text>
      </view>
      <text class="font-bold" :style="{ color: amountColor }">{{ formatFloat(bill.amount) }}</text>
    </view>

    <!-- 账单内容 -->
    <view class="ml-9">
      <view class="flex items-center justify-between">
        <text>{{ dayjs(bill.date).format('HH:MM') }}</text>
        <text class="pl-4">{{ bill.account.name }}</text>
      </view>
      <text v-if="bill.remark" class="line-clamp-1 mt-2">{{ bill.remark }}</text>
      <view v-if="bill.address" class="mt-2 flex items-center">
        <wd-icon name="location" />
        <text class="line-clamp-1 ml-2">{{ bill.address }}</text>
      </view>
      <view v-if="bill.tags && bill.tags.length > 0" class="bill-tags mt-2 flex overflow-x-auto space-x-2">
        <view v-for="tag in bill.tags" :key="tag" class="flex-shrink-0 rounded-full bg-indigo-300/40 px-2 py-1 text-xs">
          {{ tag }}
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.bill-tags::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
  color: transparent;
  background: transparent;
}
</style>
