<script lang="ts" setup>
import type { IBillSummaryAccount, IBillSummaryAmount, IBillSummaryCategory, IBillSummaryTag } from '@/api/types/bill'
import dayjs from 'dayjs'
import { summaryAccountBill, summaryAmountBill, summaryCategoryBill, summaryTagBill } from '@/api/bill'
import { useLedgerPickerStore } from '@/store'

const props = defineProps<{

}>()
defineExpose({
  init,
})

const ledgerPickerStore = useLedgerPickerStore()

const mounted = ref(false)
const contentHeight = ref(0)
const options = ref()
const active = ref(0)
const paging = ref()

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

const category = ref<IBillSummaryCategory>({
  expends: [],
  incomes: [],
})

const account = ref<IBillSummaryAccount>({
  expends: [],
  incomes: [],
})

const tag = ref<IBillSummaryTag>({
  tags: [],
})

const dateRange = computed(() => {
  const date = dayjs(options.value[active.value])
  return {
    beginDate: date.startOf('year').format('YYYY-MM-DD 00:00:00'),
    endDate: date.endOf('year').format('YYYY-MM-DD 23:59:59'),
  }
})

watch(() => active.value, () => {
  paging.value.reload()
})

function init(height: number) {
  mounted.value = true
  contentHeight.value = height
  options.value = getYears(new Date().getFullYear(), 20)
  loadData()
}

function loadData() {
  getSummaryAmountBill()
  getSummaryCategoryBill()
  getSummaryAccountBill()
  getSummaryTagBill()
}

function getSummaryAmountBill() {
  summaryAmountBill({
    ...dateRange.value,
    series: 1,
    ledgerIds: ledgerPickerStore.selecteds,
  }).then((res) => {
    summary.value = res
  })
}

function getSummaryCategoryBill() {
  summaryCategoryBill({
    ...dateRange.value,
    ledgerIds: ledgerPickerStore.selecteds,
  }).then((res) => {
    category.value = res
  })
}

function getSummaryAccountBill() {
  summaryAccountBill({
    ...dateRange.value,
    ledgerIds: ledgerPickerStore.selecteds,
  }).then((res) => {
    account.value = res
  })
}

function getSummaryTagBill() {
  summaryTagBill({
    ...dateRange.value,
    ledgerIds: ledgerPickerStore.selecteds,
  }).then((res) => {
    tag.value = res
  })
}

function handleScrollToLower() {
  const last = options.value[options.value.length - 1]
  options.value.push(...getYears(last))
}

function getYears(year: number, count = 10) {
  const dates = Array.from({ length: count }, (_, i) => {
    return (year - i).toString()
  })
  // console.log(dates, '2222')
  return dates
}

function handleQuery() {
  // console.log('handleQuery')
  loadData()
  paging.value.complete()
}
</script>

<template>
  <view v-if="mounted" :style="{ height: `${contentHeight}px` }" class="w-full">
    <z-paging ref="paging" :fixed="false" refresher-only @query="handleQuery">
      <template #top>
        <view class="z-5 bg-white/70 pb-2 pt-3 backdrop-blur-md">
          <view class="px-2">
            <mbill-segmented v-model="active" :options="options" @scrolltolower="handleScrollToLower">
              <template #content="{ option }">
                <view class="flex flex-col justify-center rounded-xl bg-indigo-300/20 px-3 py-4">
                  <view class="flex items-end">
                    <text class="text-base font-semibold">
                      {{ option.value.substring(2) }}
                    </text>
                    <text>年</text>
                  </view>
                  <text class="text-center text-12px">{{ option.value.substring(0, 2) }}</text>
                </view>
              </template>
            </mbill-segmented>
          </view>
        </view>
      </template>

      <view class="mx-3 space-y-4">
        <!-- 汇总 -->
        <view class="mon-statis-block">
          <statis-amount-summary :summary="summary.summary" />
        </view>

        <!-- TODO：增加个热力图 -->

        <view class="mon-statis-block">
          <statis-amount-charts date-type="month" :data="summary.series" />
        </view>

        <view class="mon-statis-block">
          <statis-category-charts :data="category" />
        </view>

        <view class="mon-statis-block">
          <statis-account-charts :data="account" />
        </view>

        <view class="mon-statis-block">
          <statis-tag-charts :data="tag" />
        </view>

        <view class="mon-statis-block">
          <statis-amount-report date-type="month" :data="summary.series" />
        </view>
      </view>

      <wd-gap height="20" />
    </z-paging>
  </view>
</template>

<style lang="scss" scoped>
.mon-statis-block {
  @apply: rounded-lg bg-indigo-300/20 p-2;
}
</style>
