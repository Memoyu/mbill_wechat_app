<script setup lang="ts">
import type { IBillSummaryTag } from '@/api/types/bill'
import { billOptions } from '@/typings'
import { getBillColor } from '@/utils'

const props = defineProps<{
  data: IBillSummaryTag
}>()

const chartOpts = ref({
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
const chartData = ref({
  series: [
    {
      data: [] as { name: string, value: number }[],
    },
  ],
})

const type = ref(0)

watch(() => props.data, () => {
  changeTagSummary()
}, { deep: true })

watch(() => type.value, () => {
  changeTagSummary()
})

function changeTagSummary() {
  const ts: any[] = []
  props.data.tags.forEach((t) => {
    if (type.value === 0 && t.expendCount > 0) {
      ts.push({
        name: t.name,
        value: t.expend,
        labelText: t.name,
      })
    }
    if (type.value === 1 && t.incomeCount > 0) {
      ts.push({
        name: t.name,
        value: t.income,
        // labelText: t.name,
      })
    }
  })
  // console.log('chartData', ts)
  chartData.value.series[0].data = ts
}
</script>

<template>
  <view class="mb-4 flex items-center justify-between">
    <text class="font-semibold">标签数据</text>
    <view>
      <mbill-segmented v-model="type" :options="billOptions" />
    </view>
  </view>
  <view class="h-250px">
    <qiun-data-charts
      type="pie"
      canvas2d
      in-scroll-view
      :opts="chartOpts"
      :chart-data="chartData"
    />
  </view>
  <view class="mt-3 max-h-220px overflow-y-auto space-y-3">
    <view v-for="item in data.tags" :key="item.tagId">
      <view class="flex items-center justify-between">
        <view class="flex items-baseline space-x-1">
          <text class="font-semibold">
            {{ item.name }}
          </text>
          <text class="text-xs text-gray-500">
            {{ item.expendCount + item.incomeCount }}笔
          </text>
        </view>
        <view class="flex flex-col">
          <view class="flex space-x-1" :style="{ color: getBillColor(0) }">
            <text>支:</text>
            <wd-text :text="item.expend" mode="price" />
          </view>
          <view class="flex space-x-1" :style="{ color: getBillColor(1) }">
            <text>收:</text>
            <wd-text :text="item.income" mode="price" />
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
</style>
