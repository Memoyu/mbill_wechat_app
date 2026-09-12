<script setup lang="ts">
import type { IBillSummaryAmountItem } from '@/api/types/bill'
import { billColors } from '@/constants/billIcons'
import { BillOptions } from '@/typings'

const props = defineProps<{
  dateType: 'date' | 'month'
  data: IBillSummaryAmountItem []
}>()

const isDate = computed(() => props.dateType === 'date')

const summaryOpts = ref({
  color: ['#f87171'],
  enableScroll: false,
  dataLabel: false,
  legend: {
    show: false,
  },
  xAxis: {
    disableGrid: true,
    formatter: (val: number | string, index: number) => {
      // 月份的全部展示
      if (!isDate.value) {
        return val.toString()
      }

      // 如果是偶数则不显示
      if (index % 2 !== 0) {
        return ''
      }
      // 如果是奇数则显示
      return val.toString()
    },
  },
  yAxis: {
    disableGrid: true,
  },
  extra: {
    column: {
      type: 'group',
      width: 6,
      activeBgColor: '#000000',
      activeBgOpacity: 0.08,
      seriesGap: 5,
      linearOpacity: 0.5,
      barBorderCircle: true,
    },
  },
})
const summaryData = ref({
  categories: [] as number[],
  series: [
    {
      name: '日支出',
      data: [] as number[],
    },
  ],
})

const type = ref(0)

watch(() => props.data, () => {
  changeAmountSummary()
}, { deep: true })

watch(() => type.value, () => {
  changeAmountSummary()
})

function changeAmountSummary() {
  const categories: number[] = []
  const series: number[] = []
  props.data.forEach((item, index) => {
    categories.push(index + 1)
    series.push(type.value === 1 ? item.income : item.expend)
  })

  let name = isDate.value ? '日支出' : '月支出'
  if (type.value === 1) {
    name = isDate.value ? '日收入' : '月收入'
  }
  summaryOpts.value.color = [billColors[type.value === 1 ? 1 : 0]]
  summaryData.value.categories = categories
  summaryData.value.series = [{ name, data: series }]
}
</script>

<template>
  <view class="mb-4 flex items-center justify-between">
    <text class="font-semibold">
      收支统计
    </text>
    <view>
      <mbill-segmented v-model="type" :options="BillOptions" />
    </view>
  </view>
  <view class="h-160px">
    <qiun-data-charts
      type="column"
      canvas2d
      in-scroll-view
      :opts="summaryOpts"
      :chart-data="summaryData"
    />
  </view>
</template>

<style lang="scss" scoped>
</style>
