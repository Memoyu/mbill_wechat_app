<script lang="ts" setup>
import type { IBillQuery, IBillSummaryAccount, IBillSummaryAmount, IBillSummaryCategory, IBillSummaryTag } from '@/api/types/bill'
import dayjs from 'dayjs'
import { summaryAccountBill, summaryAmountBill, summaryCategoryBill, summaryTagBill } from '@/api/bill'
import { useFilterBillStore } from '@/store'

defineExpose({
  init,
})

const filterBillStore = useFilterBillStore()

const mounted = ref(false)
const contentHeight = ref(0)
const paging = ref()
const showFilter = ref(false)
const filter = computed(() => filterBillStore.filter)

const dateText = computed(() => `${dayjs(filter.value.beginDate).format('YYYY年MM月DD日')} ~ ${dayjs(filter.value.endDate).format('YYYY年MM月DD日')}`)
const query = computed(() => {
  return {
    beginDate: filter.value.beginDate,
    endDate: filter.value.endDate,
    ledgerIds: filter.value.ledgers,
    categoryIds: filter.value.categories,
    accountIds: filter.value.accounts,
    tagIds: filter.value.tags,
  } as IBillQuery
})

const summary = ref<IBillSummaryAmount>({
  summary: {
    date: '',
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
  items: [],
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

function init(height: number) {
  mounted.value = true
  contentHeight.value = height
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
    ...query.value,
    series: 2,
  }).then((res) => {
    summary.value = res
  })
}

function getSummaryCategoryBill() {
  summaryCategoryBill({
    ...query.value,
  }).then((res) => {
    category.value = res
  })
}

function getSummaryAccountBill() {
  summaryAccountBill({
    ...query.value,
  }).then((res) => {
    account.value = res
  })
}

function getSummaryTagBill() {
  summaryTagBill({
    ...query.value,
  }).then((res) => {
    tag.value = res
  })
}

function handleFilterConfirm() {
  // console.log('handleFilterConfirm', filter)
  handleQuery()
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
        <view class="z-5 bg-white/70 px-4 py-3 backdrop-blur-md">
          <view class="flex items-center justify-between">
            <text class="font-semibold">{{ dateText }}</text>
            <wd-icon name="filter" size="20px" @tap="showFilter = true" />
          </view>
        </view>
      </template>

      <view class="mx-3 space-y-4">
        <view class="cust-statis-block">
          <statis-amount-summary :data="summary.summary" />
        </view>

        <view class="cust-statis-block">
          <statis-amount-trend-charts date-type="custom" :data="summary.items" />
        </view>

        <view class="cust-statis-block">
          <statis-category-charts :data="category" />
        </view>

        <view class="cust-statis-block">
          <statis-account-charts :data="account" />
        </view>

        <view class="cust-statis-block">
          <statis-tag-charts :data="tag" />
        </view>
      </view>
    </z-paging>
  </view>

  <!-- 筛选弹窗 -->
  <bill-filter-popup v-model="showFilter" :no-show="[0, 6]" @confirm="handleFilterConfirm" />
</template>

<style lang="scss" scoped>
.cust-statis-block {
  @apply: rounded-lg bg-indigo-200/20 p-2;
}
</style>
