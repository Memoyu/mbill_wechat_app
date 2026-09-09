<script lang="ts" setup>
import type { Dayjs } from 'dayjs'
import type { IBillSummaryAmount } from '@/api/types/bill'
import dayjs from 'dayjs'
import { summaryAmountBill } from '@/api/bill'
import { billColors } from '@/constants/billIcons'
import { useLedgerPickerStore } from '@/store'
import { BillOptions } from '@/typings'
import { getBillColor } from '@/utils'

defineOptions({
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared',
  },
})
const props = defineProps<{
}>()
defineExpose({
  init,
})

const ledgerPickerStore = useLedgerPickerStore()

const contentHeight = ref(0)
const options = ref()
const active = ref(0)
const paging = ref()
const billType = ref({
  summary: 0,
  category: 0,
  member: 0,
  tag: 0,
})

const summary = ref<IBillSummaryAmount>({
  summary: {
    income: 0,
    expend: 0,
    surplus: 0,
    incomeAvg: 0,
    expendAvg: 0,
    surplusAvg: 0,
    expendHighest: 0,
    expendLowst: 0,
    incomeHighest: 0,
    incomeLowst: 0,
  },
  series: [],
})

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

const categoryOpts = ref({
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
const categoryData = ref({
  series: [
    {
      data: [{ name: '一班', value: 50 }, { name: '二班', value: 30 }, { name: '三班', value: 20 }, { name: '四班', value: 18, labelText: '四班:18人' }, { name: '五班', value: 8 }] as { name: string, value: number }[],
    },
  ],
})

watch(() => billType.value.summary, () => {
  changeSummary()
})

function init(height: number) {
  contentHeight.value = height
  options.value = getMonths(dayjs(), 20)
  getSummaryAmountBill()
}

function getSummaryAmountBill() {
  const date = dayjs(options.value[active.value])

  summaryAmountBill({
    beginDate: date.startOf('month').format('YYYY-MM-DD 00:00:00'),
    endDate: date.endOf('month').format('YYYY-MM-DD 23:59:59'),
    series: 2,
    ledgerIds: ledgerPickerStore.selectedLedgers,
  }).then((res) => {
    summary.value = res
    changeSummary()
  })
}

function changeSummary() {
  const categories: number[] = []
  const series: number[] = []
  summary.value.series.forEach((item, index) => {
    categories.push(index + 1)
    series.push(billType.value.summary === 1 ? item.income : item.expend)
  })

  let name = '日支出'
  if (billType.value.summary === 1) {
    name = '日收入'
  }
  summaryOpts.value.color = [billColors[billType.value.summary === 1 ? 1 : 0]]
  summaryData.value.categories = categories
  summaryData.value.series = [{ name, data: series }]
}

function handleScrollToLower() {
  const last = options.value[options.value.length - 1]
  options.value.push(...getMonths(dayjs(last)))
}

function getMonths(date: Dayjs, count = 10) {
  const dates = Array.from({ length: count }, (_, i) => {
    return date.subtract(i, 'month').startOf('month').format('YYYY-MM')
  })
  return dates
}

function handleQuery() {
  // console.log('handleQuery')
  paging.value.complete()
}
</script>

<template>
  <view :style="{ height: `${contentHeight}px` }" class="w-full">
    <z-paging ref="paging" :fixed="false" refresher-only @query="handleQuery">
      <template #top>
        <view class="z-5 bg-white/70 pb-2 pt-3 backdrop-blur-md">
          <!-- 月份选择器 -->
          <view class="px-2">
            <mbill-segmented v-model="active" :options="options" @scrolltolower="handleScrollToLower">
              <template #content="{ option }">
                <view class="flex flex-col justify-center rounded-xl bg-indigo-300/20 px-3 py-4">
                  <view class="flex items-end">
                    <text class="text-base font-semibold">
                      {{ option.value.substring(5) }}
                    </text>
                    <text>月</text>
                  </view>
                  <text class="text-12px">{{ option.value.substring(0, 4) }}</text>
                </view>
              </template>
            </mbill-segmented>
          </view>
        </view>
      </template>

      <view class="mx-3 space-y-4">
        <!-- 汇总 -->
        <view class="mon-statis-block">
          <view class="grid grid-cols-3 gap-4">
            <view class="flex flex-col text-center">
              <text>月支出</text>
              <wd-text :text="summary.summary.expend" mode="price" :color="getBillColor(0)" bold />
            </view>

            <view class="flex flex-col text-center">
              <text>月收入</text>
              <wd-text :text="summary.summary.income" mode="price" :color="getBillColor(1)" bold />
            </view>

            <view class="flex flex-col text-center">
              <text>月结余</text>
              <wd-text :text="summary.summary.surplus" mode="price" bold color="var(--mbill-surplus-color)" />
            </view>
          </view>

          <view class="grid grid-cols-3 mt-3 gap-4">
            <view class="flex flex-col text-center">
              <text>日均支出</text>
              <wd-text :text="summary.summary.expendAvg" mode="price" :color="getBillColor(0)" bold />
            </view>

            <view class="flex flex-col text-center">
              <text>日均收入</text>
              <wd-text :text="summary.summary.incomeAvg" mode="price" :color="getBillColor(1)" bold />
            </view>

            <view class="flex flex-col text-center">
              <text>日均结余</text>
              <wd-text :text="summary.summary.surplusAvg" mode="price" bold color="var(--mbill-surplus-color)" />
            </view>
          </view>

          <view class="grid grid-cols-4 mt-3 gap-4">
            <view class="flex flex-col text-center">
              <text>最高支出</text>
              <wd-text :text="summary.summary.expendHighest" mode="price" :color="getBillColor(0)" bold />
            </view>

            <view class="flex flex-col text-center">
              <text>最高收入</text>
              <wd-text :text="summary.summary.incomeHighest" mode="price" :color="getBillColor(1)" bold />
            </view>

            <view class="flex flex-col text-center">
              <text>最低支出</text>
              <wd-text :text="summary.summary.expendLowst" mode="price" :color="getBillColor(0)" bold />
            </view>

            <view class="flex flex-col text-center">
              <text>最低收入</text>
              <wd-text :text="summary.summary.incomeLowst" mode="price" :color="getBillColor(1)" bold />
            </view>
          </view>
        </view>

        <view class="mon-statis-block">
          <view class="flex items-center justify-between">
            <text class="font-semibold">
              收支统计
            </text>
            <view>
              <mbill-segmented v-model="billType.summary" :options="BillOptions" />
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
        </view>

        <view class="mon-statis-block">
          <view class="flex items-center justify-between">
            <text class="font-semibold">分类数据</text>
            <view>
              <mbill-segmented v-model="billType.category" :options="BillOptions" />
            </view>
          </view>
          <view class="h-250px">
            <qiun-data-charts
              type="pie"
              canvas2d
              in-scroll-view
              :opts="categoryOpts"
              :chart-data="categoryData"
            />
          </view>
          <view class="mt-3 h-220px">
            <view class="flex items-center gap-2">
              <bill-icon icon="https://oss.memoyu.com/icons/finances/14.png" text="222334" size="36" />
              <view class="flex-1 space-y-1">
                <view class="flex items-center justify-between">
                  <view class="flex gap-2">
                    <text class="font-semibold">
                      分类名称
                    </text>
                    <text class="text-sm text-gray-500">
                      2笔
                    </text>
                    <text class="text-sm text-gray-500">
                      35%
                    </text>
                  </view>
                  <wd-text :text="summary.summary.expend" mode="price" :color="getBillColor(billType.category)" bold />
                </view>
                <wd-progress :percentage="35" hide-text />
              </view>
            </view>
          </view>
        </view>

        <view class="mon-statis-block">
          <view class="flex items-center justify-between">
            <text class="font-semibold">标签数据</text>
            <view>
              <mbill-segmented v-model="billType.tag" :options="BillOptions" />
            </view>
          </view>
          <view class="h-35">
            占比图
          </view>
          <view class="h-35">
            数据条
          </view>
        </view>

        <view class="mon-statis-block">
          <view class="flex items-center justify-between">
            <text class="font-semibold">成员数据</text>
            <view>
              <mbill-segmented v-model="billType.member" :options="BillOptions" />
            </view>
          </view>
          <view class="h-35">
            占比图
          </view>
          <view class="h-35">
            数据条
          </view>
        </view>

        <view class="mon-statis-block">
          <view class="flex items-center justify-between">
            <text class="font-semibold">报表统计</text>
          </view>
          <view class="h-35 space-y-3">
            <view v-for="item in summary.series.filter(s => s.expend > 0 || s.income > 0)" :key="item.date">
              <view class="grid grid-cols-4 flex-1 gap-4 text-center">
                <text class="font-semibold">
                  {{ dayjs(item.date).format('MM-DD') }}
                </text>

                <wd-text :text="item.expend" mode="price" :color="getBillColor(0)" bold />
                <wd-text :text="item.income" mode="price" :color="getBillColor(1)" bold />
                <wd-text :text="item.surplus" mode="price" :color="getBillColor(-1)" bold />
              </view>
            </view>
          </view>
        </view>
      </view>
    </z-paging>
  </view>
</template>

<style lang="scss" scoped>
.mon-statis-block {
  @apply: rounded-lg bg-indigo-300/20 p-2;
}
</style>
