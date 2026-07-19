<script setup lang="ts">
import type { IBillPageItem } from '@/api/types/bill'
import dayjs from 'dayjs'
import { formatFloat } from '@/utils'
import { getBillColor } from '@/utils/bill'

const props = defineProps<{
  bill: IBillPageItem
}>()

function handleBillTap() {
  // console.log("账单", props.bill);
  uni.navigateTo({
    url: `/pages/bill/detail?id=${props.bill.billId}`,
  })
}
</script>

<template>
  <view class="text-sm" @tap="handleBillTap">
    <view class="mb-2 flex items-center justify-between">
      <!-- 分类 -->
      <view class="flex items-center">
        <bill-icon :icon="bill.category.icon" :text="bill.category.name" />
        <text class="ml-2">{{ bill.category.name }}</text>
      </view>
      <!-- 金额 -->
      <text class="font-bold" :style="{ color: getBillColor(bill.type) }">{{ formatFloat(bill.amount) }}</text>
    </view>

    <view class="ml-9 flex flex-col text-xs text-gray-500 space-y-1">
      <!-- 账户 -->
      <view class="flex items-center justify-between">
        <text>{{ bill.account.name }}</text>
        <text>{{ dayjs(bill.date).format('HH:mm') }}</text>
      </view>

      <!-- 退款 -->
      <view v-if="bill.refundAmount > 0" class="flex items-center justify-between">
        <view class="rounded-md bg-yellow-500/50 px-1 py-0.5">
          <text>退款 {{ bill.refundAmount }}</text>
        </view>
        <wd-text :text="bill.amount + bill.refundAmount" mode="price" decoration="line-through" />
      </view>

      <!-- 备注 -->
      <text v-if="bill.remark" class="line-clamp-1">{{ bill.remark }}</text>

      <!-- 地址 -->
      <view v-if="bill.address" class="flex items-center">
        <wd-icon name="location" />
        <text class="line-clamp-1 ml-2">{{ bill.address }}</text>
      </view>

      <!-- 标签 -->
      <view v-if="bill.tags && bill.tags.length > 0" class="hide-view-scrollbar mt-2 flex overflow-x-auto space-x-2">
        <view v-for="tag in bill.tags" :key="tag.tagId" class="flex-shrink-0 rounded-full bg-indigo-300/40 px-2 py-1 text-xs">
          {{ tag.name }}
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>

</style>
