<script setup lang="ts">
import type { IBillSummaryAccount } from '@/api/types/bill'
import { BillOptions } from '@/typings'
import { getBillColor } from '@/utils'

const props = defineProps<{
  data: IBillSummaryAccount
}>()

const accountOpts = ref({
  color: ['#1890FF', '#91CB74', '#FAC858', '#EE6666', '#73C0DE', '#3CA272', '#FC8452', '#9A60B4', '#ea7ccc'],
  padding: [5, 5, 5, 5],
  enableScroll: false,
  extra: {
    pie: {
      activeOpacity: 0.5,
      activeRadius: 10,
      offsetAngle: 0,
      labelWidth: 15,
      border: true,
      borderWidth: 1.5,
      borderColor: '#FFFFFF',
    },
  },
})
const accountData = ref({
  series: [
    {
      data: [] as { name: string, value: number }[],
    },
  ],
})

const type = ref(0)

watch(() => props.data, () => {
  changeAccountSummary()
}, { deep: true })

watch(() => type.value, () => {
  changeAccountSummary()
})

function changeAccountSummary() {
  accountData.value.series[0].data = (type.value === 1 ? props.data.incomes : props.data.expends).map((item) => {
    return {
      name: item.name,
      value: item.amount,
      // labelText: item.name,
    }
  })
}
</script>

<template>
  <view class="mb-4 flex items-center justify-between">
    <text class="font-semibold">账户数据</text>
    <view>
      <mbill-segmented v-model="type" :options="BillOptions" />
    </view>
  </view>
  <view class="h-250px">
    <qiun-data-charts
      type="pie"
      canvas2d
      in-scroll-view
      :opts="accountOpts"
      :chart-data="accountData"
    />
  </view>
  <view class="mt-3 max-h-220px overflow-y-auto space-y-3">
    <view v-for="item in (type === 1 ? data.incomes : data.expends)" :key="item.accountId">
      <view class="flex items-center gap-2">
        <bill-icon :icon="item.icon" :text="item.name" size="36" />
        <view class="flex-1 space-y-1">
          <view class="flex items-center justify-between">
            <view class="flex gap-2">
              <text class="font-semibold">
                {{ item.name }}
              </text>
              <text class="text-sm text-gray-500">
                {{ item.count }}笔
              </text>
              <text class="text-sm text-gray-500">
                {{ item.percent }}%
              </text>
            </view>
            <wd-text :text="item.amount" mode="price" :color="getBillColor(type)" />
          </view>
          <wd-progress :percentage="item.percent" hide-text />
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
</style>
