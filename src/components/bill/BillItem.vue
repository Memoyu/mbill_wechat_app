<script setup lang="ts">
import type { IBillPageItem } from '@/api/types/bill'
import dayjs from 'dayjs'
import { amountFormat, getBillColor } from '@/utils'

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
        <bill-icon :icon="bill.category.icon" :text="bill.category.name" size="36" />
        <view class="ml-2 flex flex-col gap-0.5">
          <text>{{ bill.ledger.name }}</text>
          <text>{{ bill.category.name }}</text>
        </view>
      </view>
      <!-- 金额 -->
      <text class="font-bold" :style="{ color: getBillColor(bill.type) }">{{ amountFormat(bill.amount) }}</text>
    </view>

    <view class="ml-9 flex flex-col text-xs text-gray-500 space-y-2">
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
      <view v-if="bill.tags && bill.tags.length > 0" class="relative">
        <scroll-view scroll-x enhanced :show-scrollbar="false" class="relative flex-1" :bounces="false">
          <view class="min-w-max flex items-center gap-2.5 whitespace-nowrap">
            <view v-for="tag in bill.tags" :key="tag.tagId" class="flex-shrink-0 rounded-md bg-indigo-300/40 px-2 py-1 text-xs">
              {{ tag.name }}
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>

</style>
