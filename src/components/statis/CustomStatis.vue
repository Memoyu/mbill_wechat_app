<script lang="ts" setup>
import type { IBillQuery, IBillSummaryAccount, IBillSummaryAmount, IBillSummaryCategory, IBillSummaryTag } from '@/api/types/bill'
import dayjs from 'dayjs'
import { summaryAccountBill, summaryAmountBill, summaryCategoryBill, summaryTagBill } from '@/api/bill'
import { useGlobalLoading } from '@/hooks/useGlobalLoading'
import { useFilterBillStore, useSettingsStore } from '@/store'

defineOptions({
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared',
  },
})

defineExpose({
  init,
  reload,
})

const loading = useGlobalLoading()
const filterBillStore = useFilterBillStore()
const settingsStore = useSettingsStore()

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
    ledgerIds: settingsStore.statis.ledgers,
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

function reload() {
  loadData()
}

async function loadData() {
  loading.loading('数据加载...')
  try {
    await Promise.allSettled([
      getSummaryAmountBill(),
      getSummaryCategoryBill(),
      getSummaryAccountBill(),
      getSummaryTagBill(),
    ])
  }
  finally {
    loading.close()
  }
}

async function getSummaryAmountBill() {
  const res = await summaryAmountBill({
    ...query.value,
    series: 2,
  })
  summary.value = res
}

async function getSummaryCategoryBill() {
  const res = await summaryCategoryBill({
    ...query.value,
  })
  category.value = res
}

async function getSummaryAccountBill() {
  const res = await summaryAccountBill({
    ...query.value,
  })
  account.value = res
}

async function getSummaryTagBill() {
  const res = await summaryTagBill({
    ...query.value,
  })
  tag.value = res
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
        <view class="mb-backdrop-blur-bg z-5 px-5 py-3">
          <view class="flex items-center justify-between">
            <text class="font-semibold">{{ dateText }}</text>
            <wd-icon name="filter" size="20px" @tap="showFilter = true" />
          </view>
        </view>
      </template>

      <view class="mx-3 mt-2 space-y-4">
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
  <bill-filter-popup v-model="showFilter" height="50vh" :no-show="[0, 2, 6]" @confirm="handleFilterConfirm" />
</template>

<style lang="scss" scoped>
.cust-statis-block {
  @apply: mb-block-bg rounded-lg p-2;
}
</style>
