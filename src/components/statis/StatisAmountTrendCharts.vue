<script setup lang="ts">
import type { IBillSummaryAmount } from '@/api/types/bill'
import dayjs from 'dayjs'
import { billColors } from '@/constants/billIcons'
import { billOptions } from '@/typings'

const props = defineProps<{
  dateType: 'date' | 'month' | 'custom'
  data: IBillSummaryAmount []
}>()

const chartOpts = ref({
  color: [...billColors],
  padding: [5, 0, 0, 0],
  dataLabel: false,
  dataPointShape: false,
  enableScroll: false,
  legend: {},
  xAxis: {
    disableGrid: true,
    boundaryGap: 'justify',
    fontSize: 12,
    formatter: (val: number | string, index: number) => {
      let text = ''
      dateTypeFunc(() => {
        // 跳位显示
        if (index % 2 === 0)
          text = val.toString().replace('日', '')
      }, () => {
        text = val.toString().replace('月', '')
      }, () => {
        if (index === 0 || index === props.data.length - 1)
          text = val.toString()
      })
      return text
    },
  },
  yAxis: {
    disableGrid: true,
  },
  extra: {
    area: {
      type: 'curve',
      opacity: 0.2,
      addLine: true,
      width: 1,
      gradient: true,
    },
    tooltip: {
      showCategory: true,
    },
  },
})
const chartData = ref({
  categories: [] as string[],
  series: [
    { name: '支出', data: [] as number[], legendShape: 'line' },
    { name: '收入', data: [] as number[], legendShape: 'line' },
    { name: '结余', data: [] as number[], legendShape: 'line' },
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
  const categories: string[] = []
  const expendSeries: number[] = []
  const incomeSeries: number[] = []
  const surplusSeries: number[] = []
  let incomes = 0
  props.data.forEach((it) => {
    const item = it.summary
    let d = dayjs(item.date).format('YYYY.MM.DD')
    dateTypeFunc(() => {
      d = `${dayjs(item.date).date()}日`
    }, () => {
      d = `${(dayjs(item.date).month() + 1)}月`
    })

    incomes += item.income
    categories.push(d)
    expendSeries.push(item.expend)
    incomeSeries.push(item.income)
    surplusSeries.push(incomes - item.expend)
  })

  chartData.value.categories = categories
  dateTypeFunc(() => {
    chartOpts.value.padding = [5, 8, 0, 0]
    chartData.value.series[0].name = '日支出'
    chartData.value.series[1].name = '日收入'
  }, () => {
    chartOpts.value.padding = [5, 8, 0, 0]
    chartData.value.series[0].name = '月支出'
    chartData.value.series[1].name = '月收入'
  }, () => {
    chartOpts.value.padding = [5, 30, 0, 0]
    chartData.value.series[0].name = '支出'
    chartData.value.series[1].name = '收入'
  })

  chartData.value.series[0].data = expendSeries
  chartData.value.series[1].data = incomeSeries
  chartData.value.series[2].data = surplusSeries
}

function dateTypeFunc(date?: () => void, month?: () => void, custom?: () => void) {
  switch (props.dateType) {
    case 'date':
      date && date()
      break
    case 'month':
      month && month()
      break
    case 'custom':
      custom && custom()
      break
  }
}
</script>

<template>
  <view class="mb-4 flex items-center justify-between">
    <text class="font-semibold">
      收支趋势
    </text>
    <view>
      <mbill-segmented v-model="type" :options="billOptions" />
    </view>
  </view>
  <view class="h-160px">
    <qiun-data-charts
      type="area"
      canvas2d
      in-scroll-view
      :opts="chartOpts"
      :chart-data="chartData"
      tooltip-format="amountTrendChartTooltip"
    />
  </view>
</template>

<style lang="scss" scoped>
</style>
