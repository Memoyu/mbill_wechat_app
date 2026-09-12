<script lang="ts" setup>
import type { Dayjs } from 'dayjs'
import type { IBillSummaryAccount, IBillSummaryAmount, IBillSummaryCategory, IBillSummaryTag } from '@/api/types/bill'
import dayjs from 'dayjs'
import { summaryAccountBill, summaryAmountBill, summaryCategoryBill, summaryTagBill } from '@/api/bill'
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
  account: 0,
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
      data: [] as { name: string, value: number }[],
    },
  ],
})
const category = ref<IBillSummaryCategory>({
  expends: [],
  incomes: [],
})
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
const account = ref<IBillSummaryAccount>({
  expends: [],
  incomes: [],
})

const tagOpts = ref({
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
const tagData = ref({
  series: [
    {
      data: [] as { name: string, value: number }[],
    },
  ],
})
const tag = ref<IBillSummaryTag>({
  tags: [],
})

const dateRange = computed(() => {
  const date = dayjs(options.value[active.value])
  return {
    beginDate: date.startOf('month').format('YYYY-MM-DD 00:00:00'),
    endDate: date.endOf('month').format('YYYY-MM-DD 23:59:59'),
  }
})

watch(() => billType.value.summary, () => {
  changeAmountSummary()
})

watch(() => billType.value.category, () => {
  changeCategorySummary()
})

watch(() => billType.value.account, () => {
  changeAccountSummary()
})

watch(() => billType.value.tag, () => {
  changeTagSummary()
})

function init(height: number) {
  contentHeight.value = height
  options.value = getMonths(dayjs(), 20)
  getSummaryAmountBill()
  getSummaryCategoryBill()
  getSummaryAccountBill()
  getSummaryTagBill()
}

function getSummaryAmountBill() {
  summaryAmountBill({
    ...dateRange.value,
    series: 2,
    ledgerIds: ledgerPickerStore.selecteds,
  }).then((res) => {
    summary.value = res
    changeAmountSummary()
  })
}

function changeAmountSummary() {
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

function getSummaryCategoryBill() {
  summaryCategoryBill({
    ...dateRange.value,
    ledgerIds: ledgerPickerStore.selecteds,
  }).then((res) => {
    category.value = res
    changeCategorySummary()
  })
}

function changeCategorySummary() {
  categoryData.value.series[0].data = (billType.value.category === 1 ? category.value.incomes : category.value.expends).map((item) => {
    return {
      name: item.name,
      value: item.amount,
      labelText: item.name,
    }
  })
}

function getSummaryAccountBill() {
  summaryAccountBill({
    ...dateRange.value,
    ledgerIds: ledgerPickerStore.selecteds,
  }).then((res) => {
    account.value = res
    changeAccountSummary()
  })
}

function changeAccountSummary() {
  accountData.value.series[0].data = (billType.value.account === 1 ? account.value.incomes : account.value.expends).map((item) => {
    return {
      name: item.name,
      value: item.amount,
      labelText: item.name,
    }
  })
}

function getSummaryTagBill() {
  summaryTagBill({
    ...dateRange.value,
    ledgerIds: ledgerPickerStore.selecteds,
  }).then((res) => {
    tag.value = res
    changeTagSummary()
  })
}

function changeTagSummary() {
  const ts: any[] = []
  tag.value.tags.forEach((t) => {
    if (billType.value.tag === 0 && t.expendCount > 0) {
      ts.push({
        name: t.name,
        value: t.expend,
        labelText: t.name,
      })
    }
    if (billType.value.tag === 1 && t.incomeCount > 0) {
      ts.push({
        name: t.name,
        value: t.income,
        labelText: t.name,
      })
    }
  })
  console.log('tagData', ts)
  tagData.value.series[0].data = ts
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
          <view class="mt-3 max-h-220px overflow-y-auto space-y-3">
            <view v-for="item in (billType.category === 1 ? category.incomes : category.expends)" :key="item.categoryId">
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
                    <wd-text :text="item.amount" mode="price" :color="getBillColor(billType.category)" bold />
                  </view>
                  <wd-progress :percentage="item.percent" hide-text />
                </view>
              </view>
            </view>
          </view>
        </view>

        <view class="mon-statis-block">
          <view class="flex items-center justify-between">
            <text class="font-semibold">账户数据</text>
            <view>
              <mbill-segmented v-model="billType.account" :options="BillOptions" />
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
            <view v-for="item in (billType.account === 1 ? account.incomes : account.expends)" :key="item.accountId">
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
                    <wd-text :text="item.amount" mode="price" :color="getBillColor(billType.account)" bold />
                  </view>
                  <wd-progress :percentage="item.percent" hide-text />
                </view>
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
          <view class="h-250px">
            <qiun-data-charts
              type="pie"
              canvas2d
              in-scroll-view
              :opts="tagOpts"
              :chart-data="tagData"
            />
          </view>
          <view class="mt-3 max-h-220px overflow-y-auto space-y-3">
            <view v-for="item in tag.tags" :key="item.tagId">
              <view class="flex items-center justify-between">
                <view class="flex items-baseline space-x-1">
                  <text class="font-semibold">
                    {{ item.name }}
                  </text>
                  <text class="text-xs text-gray-500">
                    {{ item.expendCount + item.incomeCount }}笔
                  </text>
                </view>
                <view class="flex flex-col gap-0.5">
                  <wd-text :text="item.expend" mode="price" :color="getBillColor(0)" bold />
                  <wd-text :text="item.income" mode="price" :color="getBillColor(1)" bold />
                </view>
              </view>
            </view>
          </view>
        </view>

        <view class="mon-statis-block">
          <view class="flex items-center justify-between">
            <text class="font-semibold">报表统计</text>
          </view>
          <view class="h-40 overflow-y-auto space-y-3">
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
      <wd-gap height="20" />
    </z-paging>
  </view>
</template>

<style lang="scss" scoped>
.mon-statis-block {
  @apply: rounded-lg bg-indigo-300/20 p-2 space-y-2;
}
</style>
