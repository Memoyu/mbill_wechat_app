<script setup lang="ts">
import dayjs from 'dayjs'
import { billColors, dateTypes } from '@/constants/billIcons'
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
const emit = defineEmits(['more'])

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

const indexBillStore = useIndexBillStore()
const settingsStore = useSettingsStore()

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

watch(() => settingsStore.index.charts.date, (date) => {
  const today = dayjs()
  chartData.value.categories = date === 0
    ? Array.from({ length: 7 }, (_, i) => today.day(1).add(i, 'day').format('D'))
    : date === 1
      ? Array.from({ length: 7 }, (_, i) => today.subtract(6 - i, 'day').format('D'))
      : Array.from({ length: 15 }, (_, i) => today.subtract(14 - i, 'day').format('D'))
}, { immediate: true })

watch(() => charts.value, (data) => {
  if (!data.items.length)
    return

  setTimeout(() => {
  // 数据源变更后构造数据
    const expendSeries: number[] = []
    const incomeSeries: number[] = []
    data.items.forEach((it) => {
      const item = it.summary
      expendSeries.push(item.expend)
      incomeSeries.push(item.income)
    })

    const type = settingsStore.index.charts.type
    if (type === 0) {
      chartOpts.value.color = [billColors[0]]
      chartData.value.series = [{ name: '日支出', data: expendSeries }]
    }
    else if (type === 1) {
      chartOpts.value.color = [billColors[1]]
      chartData.value.series = [{ name: '日收入', data: incomeSeries }]
    }
    else {
      chartOpts.value.color = [...billColors]
      chartData.value.series = [{ name: '日支出', data: expendSeries }, { name: '日收入', data: incomeSeries }]
    }
    // console.log(chartData.value.series, ' chartData.value.series')
  }, 500)
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
      <action-btn @tap="emit('more')">
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
