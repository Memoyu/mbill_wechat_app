<script setup lang="ts">
import dayjs from 'dayjs'
import { billColors } from '@/constants/billIcons'
import { useIndexBillStore, useSettingsStore } from '@/store'
import { amountFormat, getBillColor } from '@/utils'

defineOptions({
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared',
  },
})

const props = defineProps<{
}>()
const settingShow = defineModel({ default: false })

const chartOpts = ref({
  color: [...billColors],
  padding: [15, 15, 0, 5],
  enableScroll: false,
  dataLabel: false,
  legend: {
    show: false,
  },
  xAxis: {
    disableGrid: true,
  },
  yAxis: {
    disabled: true,
    disableGrid: true,
  },
  extra: {
    column: {
      type: 'group',
      width: 8,
      activeBgColor: '#000000',
      activeBgOpacity: 0.08,
      seriesGap: 2,
      linearOpacity: 0.5,
      barBorderCircle: true,
    },
  },
})

const dateTypes = [
  {
    label: '本周',
    value: 0,
  },
  {
    label: '近7天',
    value: 1,
  },
  {
    label: '近15天',
    value: 2,
  },
]

const indexBillStore = useIndexBillStore()
const settingsStore = useSettingsStore()

const innerType = ref()
const chartData = ref<{
  categories: string[]
  series: {
    name: string
    data: number[]
  }[]
}>({
  categories: [],
  series: [
    {
      name: '日支出',
      data: [],
    },
    {
      name: '日收入',
      data: [],
    },
  ],
})

const dateTitle = computed(() => dateTypes[settingsStore.index.charts.date].label)
const typeTitle = computed(() => settingsStore.index.charts.type === 0 ? '支出' : settingsStore.index.charts.type === 1 ? '收入' : '')
const charts = computed(() => indexBillStore.charts)

watch(() => charts.value, (data) => {
  // 数据源变更后构造数据
  const categories: string[] = []
  const expendSeries: number[] = []
  const incomeSeries: number[] = []
  data.items.forEach((it) => {
    const item = it.summary
    const date = dayjs(item.date)
    categories.push(date.date().toString())
    expendSeries.push(item.expend)
    incomeSeries.push(item.income)
  })

  chartData.value.categories = categories
  if (innerType.value === 0) {
    chartOpts.value.color = [billColors[0]]
    chartData.value.series = [{ name: '日支出', data: expendSeries }]
  }
  else if (innerType.value === 1) {
    chartOpts.value.color = [billColors[1]]
    chartData.value.series = [{ name: '日收入', data: incomeSeries }]
  }
  else {
    chartOpts.value.color = [...billColors]
    chartData.value.series = [{ name: '日支出', data: expendSeries }, { name: '日收入', data: incomeSeries }]
  }
}, { deep: true })
</script>

<template>
  <view v-if="settingsStore.index.charts.show">
    <view class="flex items-center justify-between">
      <view>
        <view class="font-bold">
          {{ dateTitle }}{{ typeTitle }}汇总
        </view>
        <view class="flex gap-3 text-sm text-gray-400">
          <view class="flex gap-2">
            <text>支:</text>
            <text class="font-semibold" :style="{ color: getBillColor(0) }">
              {{ amountFormat(charts.summary.expend) }}
            </text>
          </view>
          <view class="flex gap-2">
            <text>收:</text>
            <text class="font-semibold" :style="{ color: getBillColor(1) }">
              {{ amountFormat(charts.summary.income) }}
            </text>
          </view>
        </view>
      </view>
      <action-btn @tap="settingShow = true">
        <view class="iconfont icon-more" />
      </action-btn>
    </view>
    <view class="col-amount-summary-box">
      <qiun-data-charts
        type="column"
        canvas2d
        in-scroll-view
        :opts="chartOpts"
        :chart-data="chartData"
      />
    </view>
  </view>
</template>

<style lang="scss" scoped>
.col-amount-summary-box {
  height: 150px;
}
</style>
