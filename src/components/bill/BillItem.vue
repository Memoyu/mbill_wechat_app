<script setup lang="ts">
import type { IBill } from '@/api/types/bill'
import dayjs from 'dayjs'
import { formatFloat } from '@/utils'

const props = defineProps<{
  bill: IBill
}>()

const categoryText = computed(() => {
  return props.bill.category.name ? props.bill.category.name.substring(0, 1) : ''
})
const categorySrc = computed(() => {
  return props.bill.category.icon ? props.bill.category.icon : ''
})

const amountClass = computed(() => {
  return props.bill.type === 0 ? 'text-[var(--mbill-expend-color)]' : 'text-[var(--mbill-income-color)]'
})

function handleBillTap() {
  // console.log("账单", props.bill);
  uni.navigateTo({
    url: `/pages/bill/detail?id=${props.bill.billId}`,
  })
}
</script>

<template>
  <view class="text-sm" @tap="handleBillTap">
    <!-- 分类图标 -->
    <view class="flex items-center justify-between">
      <view class="flex items-center">
        <wd-avatar :text="categoryText" :src="categorySrc" size="30" />
        <text class="ml-2">{{ bill.category.name }}</text>
      </view>
      <text class="font-bold" :class="[amountClass]">{{ formatFloat(bill.amount) }}</text>
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
