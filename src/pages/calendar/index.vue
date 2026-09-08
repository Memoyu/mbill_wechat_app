<script lang="ts" setup>
import type { IBillDateGroup, IBillSummaryAmount, IBillSummaryAmountItem } from '@/api/types/bill'
import type { ILedger } from '@/api/types/ledger'
import type { CalendarBillItem } from '@/components/calendar/CalendarView.vue'
import dayjs from 'dayjs'
import _ from 'lodash'
import { pageBill, summaryAmountBill } from '@/api/bill'
import { useLedgerPickerStore } from '@/store'
import { amountFormat, getBillColor, systemInfo } from '@/utils'

definePage({
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '账单日历',
  },
})

const { proxy } = getCurrentInstance() as any

const summaryCache: Array<{ date: number, data: IBillSummaryAmount }> = []

const showDateSelect = ref(false)
const showMore = ref(false)

const date = ref<number>(dayjs().valueOf())
const month = ref<number>(date.value)
const monthText = computed(() => dayjs(month.value).format('YYYY年MM月'))
const navbarHeight = ref(0)
const calendarHeight = ref(0)
const calendarPaging = ref()
const listPaging = ref()
const ledgers = ref<string[]>()
const groups = ref<IBillDateGroup[]>([])
const monthSummary = ref<IBillSummaryAmountItem> ({
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
})
const daySummaries = ref<CalendarBillItem[]> ([])

const contentHeight = ref<number>()
const floatingHeight = ref<number>()
const anchors = ref<number[]>([])
const pagingHeight = computed(() => (floatingHeight.value || 32) - 32)

watch(() => [navbarHeight.value, calendarHeight.value], ([nav, cal]) => {
  // console.log(nav, cal, 'initNavbarHeight')
  // 更新组件高度
  contentHeight.value = systemInfo.windowHeight - nav
  floatingHeight.value = contentHeight.value - cal - 16 // 留点间隙
  anchors.value = [floatingHeight.value, systemInfo.windowHeight * 0.8]
})

onLoad(() => {
  getSummaryAmountBill()
})

onMounted(() => {
  initNavbarHeight()
})

function initNavbarHeight() {
  nextTick(() => {
    uni.createSelectorQuery().in(proxy).select('#TOP_NAVBAR').boundingClientRect((nav: any) => {
      // console.log(nav, 'TOP_NAVBAR')
      navbarHeight.value = nav?.height ?? 122
    }).exec()
  })
}

function handleToday() {
  // 定位到今天
  date.value = dayjs().valueOf()
}

const debounced = _.debounce(getSummaryAmountBill, 500)
function handleMonthChange(m: number) {
  console.log('月份切换', m)
  debounced()
}

function handleDateChange(d: number) {
  console.log('日期切换', d)
  listPaging.value.reload()
}

function handleCalHeightChange(height: number) {
  // console.log(height, 'handleCalHeightChange')
  calendarHeight.value = height + 16
}

function handelFloatingHeightChange({ height }: { height: number }) {
  // console.log(height, 'handelFloatingHeightChange')
  floatingHeight.value = height
}

function handleMoreConfirm() {
  calendarPaging.value.reload()
  listPaging.value.reload()
}

function handleCalendarQuery() {
  getSummaryAmountBill(true).then(() => {
    calendarPaging.value.complete()
  })
}

async function getSummaryAmountBill(forced: boolean = false) {
  const dm = dayjs(month.value)
  const cache = summaryCache.find(c => dayjs(c.date).isSame(dm, 'month'))
  console.log(cache, 'cache')
  let data = cache?.data
  if (!data || forced) {
    data = await summaryAmountBill({
      beginDate: dm.startOf('month').format('YYYY-MM-DD 00:00:00'),
      endDate: dm.endOf('month').format('YYYY-MM-DD 23:59:59'),
      series: 2,
      ledgerIds: ledgers.value,
    })
    summaryCache.push({ date: month.value, data })
  }

  monthSummary.value = data.summary
  daySummaries.value = data.series.map(s => s as CalendarBillItem)
}

function handleListQuery(page: number, size: number) {
  console.log(page, size, 'handleQuery')
  if (page === 1) {
    groups.value = []
  }

  pageBill({
    beginDate: dayjs(date.value).format('YYYY-MM-DD 00:00:00'),
    endDate: dayjs(date.value).format('YYYY-MM-DD 23:59:59'),
    ledgerIds: ledgers.value,
    size,
    page,
  }).then((res) => {
    // 组合数据
    let items: IBillDateGroup[] = []
    if (groups.value.length === 0) {
      items = res.items
    }
    else {
      for (let i = 0; i < res.items.length; i++) {
        const g = res.items[i]
        const target = groups.value.find(i => dayjs(i.date).isSame(dayjs(g.date), 'date'))
        if (target) {
          target.items.push(...g.items)
          target.items.sort((a, b) => dayjs(a.date).isBefore(dayjs(b.date)) ? 1 : -1)
        }
        else {
          items.push(g)
        }
      }
    }

    listPaging.value.completeByNoMore(items, page * size >= res.total)
  }).catch((res) => {
    listPaging.value.complete(false)
  })
}
</script>

<template>
  <page-meta :page-style="`overflow:${showDateSelect || showMore ? 'hidden' : 'visible'};`" />
  <draw-background2 />
  <!-- 导航栏 -->
  <nav-bar id="TOP_NAVBAR">
    <template #title>
      <view class="w-full flex items-center justify-between">
        <view class="flex items-center" @tap="showDateSelect = true">
          <text class="mr-2">
            {{ monthText }}
          </text>
          <wd-icon name="caret-down" />
        </view>
        <view class="flex gap-2">
          <action-btn @tap="handleToday">
            <view class="iconfont icon-today" />
          </action-btn>

          <action-btn @tap="showMore = true">
            <view class="iconfont icon-more" />
          </action-btn>
        </view>
      </view>
    </template>
    <template #prefix-action>
      <view class="mt-2 w-full flex items-center gap-2 text-sm">
        <view class="flex gap-1">
          <text>支</text>
          <text :style="{ color: getBillColor(0) }">
            {{ amountFormat(monthSummary.expend) }}
          </text>
        </view>

        <view class="flex gap-1">
          <text>收</text>
          <text :style="{ color: getBillColor(1) }">
            {{ amountFormat(monthSummary.income) }}
          </text>
        </view>
        <view class="flex gap-1">
          <text>余</text>
          <text class="text-[var(--mbill-surplus-color)]">
            {{ amountFormat(monthSummary.surplus) }}
          </text>
        </view>
      </view>
    </template>
  </nav-bar>

  <view :style="{ height: `${contentHeight}px` }" class="w-full">
    <z-paging ref="calendarPaging" :fixed="false" refresher-only @query="handleCalendarQuery">
      <!-- 日历组件 -->
      <view id="CALENDAR" class="mx-3 rounded-3xl bg-white p-2">
        <calendar v-model="date" v-model:month="month" :bills="daySummaries" @change="handleMonthChange" @selected="handleDateChange" @heightchange="handleCalHeightChange" />
      </view>
    </z-paging>

    <!-- 浮窗展示账单列表 -->
    <wd-floating-panel :anchors="anchors" :content-draggable="false" @height-change="handelFloatingHeightChange">
      <z-paging ref="listPaging" v-model="groups" :height="`${pagingHeight}px`" :fixed="false" :refresher-enabled="false" :default-page-size="15" @query="handleListQuery">
        <bill-list-view :groups="groups" fixed-date-format />
      </z-paging>
    </wd-floating-panel>
  </view>

  <!-- 日期选择弹窗 -->
  <date-picker v-model="showDateSelect" v-model:date="month" type="year-month" />

  <!-- 更多筛选条件 -->
  <calendar-more v-model="showMore" v-model:ledgers="ledgers" @confirm="handleMoreConfirm" />
</template>

<style lang="scss" scoped>
:deep(.wd-floating-panel) {
  z-index: 6;
}
// :deep(.wd-floating-panel__header) {
//   background-color: var(--wot-avatar-bg);
// }

// :deep(.wd-floating-panel__content) {
//   background-color: var(--wot-avatar-bg);
// }
</style>
