<script setup lang="ts">
import dayjs from 'dayjs'
import { useBillStore, useSettingsStore } from '@/store'
import { formatFloat, getBillColor } from '@/utils'

defineOptions({
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared',
  },
})

const props = defineProps<{
  date: number
}>()

const colors = ['#f87171', '#4ade80']
const chartOpts = ref({
  color: [...colors],
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
const types = [
  {
    label: '支出',
    value: 0,
  },
  {
    label: '收入',
    value: 1,
  },
]
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

const billStore = useBillStore()
const settingsStore = useSettingsStore()

const showSummarySetting = ref(false)
const type = ref()
const dateType = ref(0)

const expend = ref(0)
const income = ref(0)
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

const dateTitle = computed(() => {
  return dateTypes[settingsStore.index.summary.date].label
})
const typeTitle = computed(() => {
  return settingsStore.index.summary.type === 0 ? '支出' : settingsStore.index.summary.type === 1 ? '收入' : ''
})

watch(() => showSummarySetting.value, () => {
  if (showSummarySetting.value) {
    type.value = settingsStore.index.summary.type
    dateType.value = settingsStore.index.summary.date
  }
})

watch(() => billStore.charts, (data) => {
  const categories: string[] = []
  const expendSeries: number[] = []
  const incomeSeries: number[] = []
  data.forEach((item) => {
    const date = dayjs(item.date)
    categories.push(date.date().toString())
    expendSeries.push(item.expend)
    incomeSeries.push(item.income)
  })

  chartData.value.categories = categories
  if (type.value === 0) {
    chartOpts.value.color = [colors[0]]
    chartData.value.series = [{ name: '日支出', data: expendSeries }]
  }
  else if (type.value === 1) {
    chartOpts.value.color = [colors[1]]
    chartData.value.series = [{ name: '日收入', data: incomeSeries }]
  }
  else {
    chartOpts.value.color = [...colors]
    chartData.value.series = [{ name: '日支出', data: expendSeries }, { name: '日收入', data: incomeSeries }]
  }
}, { deep: true })

onMounted(() => {
  getAmountCharts()
})

function getAmountCharts() {
  const dt = settingsStore.index.summary.date
  const type = settingsStore.index.summary.type

  // 默认本周，周一到周日
  let beginDate = dayjs().startOf('week').add(1, 'day').format('YYYY-MM-DD')
  let endDate = dayjs().format('YYYY-MM-DD')
  if (dt === 0) {
    endDate = dayjs().endOf('week').add(1, 'day').format('YYYY-MM-DD')
  }
  else if (dt === 1) {
    beginDate = dayjs().subtract(7, 'day').format('YYYY-MM-DD')
  }
  else if (dt === 2) {
    beginDate = dayjs().subtract(15, 'day').format('YYYY-MM-DD')
  }

  // 重载数据
  billStore.loadCharts(beginDate, endDate, type)
}

function handleSettingConfirm() {
  settingsStore.updateIndexSummary(dateType.value, type.value)
  getAmountCharts()
  showSummarySetting.value = false
}
</script>

<template>
  <view v-if="settingsStore.index.summary.show">
    <view class="flex items-start justify-between">
      <view>
        <view class="font-bold">
          {{ dateTitle }}{{ typeTitle }}汇总
        </view>
        <view class="flex gap-3 text-sm text-gray-400">
          <view class="flex gap-2">
            <text>支出:</text>
            <text class="font-semibold" :style="{ color: getBillColor(0) }">
              {{ formatFloat(expend) }}
            </text>
          </view>
          <view class="flex gap-2">
            <text>收入:</text>
            <text class="font-semibold" :style="{ color: getBillColor(1) }">
              {{ formatFloat(income) }}
            </text>
          </view>
        </view>
      </view>
      <view class="flex items-center justify-center rounded-full bg-white/70 p-1" @tap="showSummarySetting = true">
        <wd-icon name="more" size="18" />
      </view>
    </view>
    <view class="col-amount-summary-box">
      <qiun-data-charts
        type="column"
        canvas2d
        :opts="chartOpts"
        :chart-data="chartData"
      />
    </view>
  </view>

  <!-- 汇总设置 -->
  <bottom-popup v-model="showSummarySetting" height="30vh" title="汇总设置" @confirm="handleSettingConfirm">
    <view class="mb-3 flex flex-col p-3 space-y-2">
      <!-- 账单类型 -->
      <view>
        <view class="filter-content-title">
          账单类型
        </view>
        <wd-radio-group v-model="type" allow-uncheck type="button">
          <wd-radio v-for=" t in types" :key="t.value" :value="t.value">
            {{ t.label }}
          </wd-radio>
        </wd-radio-group>
      </view>

      <!-- 时间范围 -->
      <view>
        <view class="filter-content-title">
          时间范围
        </view>
        <wd-radio-group v-model="dateType" type="button">
          <wd-radio v-for=" dt in dateTypes" :key="dt.value" :value="dt.value">
            {{ dt.label }}
          </wd-radio>
        </wd-radio-group>
      </view>
    </view>
  </bottom-popup>
</template>

<style lang="scss" scoped>
.col-amount-summary-box {
  height: 150px;
}

.filter-content-title {
  @apply font-bold pb-2;
}
</style>
