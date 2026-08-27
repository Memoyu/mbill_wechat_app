<script lang="ts" setup>
import type { IBillDateGroup } from '@/api/types/bill'
import type { IDatePickerValue } from '@/components/base/DatePicker.vue'
import dayjs from 'dayjs'
import { pageBill } from '@/api/bill'
import { useLedgerPickerStore } from '@/store'
import { systemInfo } from '@/utils'

definePage({
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '账单日历',
  },
})

const { proxy } = getCurrentInstance() as any
const ledgerPickerStore = useLedgerPickerStore()

const isDateSelectShow = ref(false)
const date = ref<IDatePickerValue>({
  value: dayjs().valueOf(),
  type: 'year-month',
})

const month = ref<number>(date.value.value)
const monthText = computed(() => dayjs(month.value).format('YYYY年MM月'))
const navbarHeight = ref(0)
const calendarHeight = ref(0)

const calendarPaging = ref()
const listPaging = ref()
const ledgerIds = ref<string[]>(ledgerPickerStore.selectedLedgers)
const groups = ref<IBillDateGroup[]>([])

const contentHeight = ref<number>()
const floatingHeight = ref<number>()
const anchors = ref<number[]>([])
const pagingHeight = computed(() => (floatingHeight.value || 32) - 32)

watch(() => [navbarHeight.value, calendarHeight.value], ([nav, cal]) => {
  // 更新组件高度
  contentHeight.value = systemInfo.windowHeight - nav
  floatingHeight.value = contentHeight.value - cal
  anchors.value = [pagingHeight.value, systemInfo.windowHeight * 0.8]
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
}

function handleMonthChange(m: number) {
  // console.log('月份切换', m)
  month.value = m
}

function handleDateChange(d: number) {
  // console.log('日期切换', d)
  date.value.value = d
  listPaging.value.reload()
}

function handleCalHeightChange(height: number) {
  console.log(height, 'handleCalHeightChange')
  calendarHeight.value = height + 16
}

function handelFloatingHeightChange({ height }: { height: number }) {
  console.log(height, 'handelFloatingHeightChange')
  floatingHeight.value = height
}

function handleCalendarQuery() {
  calendarPaging.value.complete()
}
function handleListQuery(page: number, size: number) {
  // console.log(params, 'handleQuery')
  if (page === 1) {
    groups.value = []
  }

  const beginDate = dayjs(date.value.value).startOf('date').format('YYYY-MM-DD 00:00:00')
  const endDate = dayjs(date.value.value).endOf('date').format('YYYY-MM-DD 23:59:59')

  pageBill({
    beginDate,
    endDate,
    ledgerIds: ledgerIds.value,
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
  <page-meta :page-style="`overflow:${isDateSelectShow ? 'hidden' : 'visible'};`" />
  <draw-background2 />
  <!-- 导航栏 -->
  <nav-bar id="TOP_NAVBAR">
    <template #title>
      <view class="w-full flex items-center justify-between">
        <view class="flex items-center" @tap="isDateSelectShow = true">
          <text class="mr-2">
            {{ monthText }}
          </text>
          <wd-icon name="caret-down" />
        </view>
        <view class="iconfont icon-today text-xl" @click="handleToday" />
      </view>
    </template>
    <template #prefix-action>
      <view class="mt-3 flex items-center gap-3 text-sm">
        <view class="flex">
          <view>
            收入
          </view>
          <view class="ml-1 text-emerald">
            2000000
          </view>
        </view>

        <view class="flex">
          <view>
            支出
          </view>
          <view class="ml-1 text-rose">
            2000000
          </view>
        </view>

        <view class="flex">
          <view>
            结余
          </view>
          <view class="ml-1 text-gray">
            2000000
          </view>
        </view>
      </view>
    </template>
  </nav-bar>

  <view :style="{ height: `${contentHeight}px` }" class="w-full">
    <z-paging ref="calendarPaging" :fixed="false" refresher-only @query="handleCalendarQuery">
      <!-- 日历组件 -->
      <view id="CALENDAR" class="mx-3 rounded-3xl bg-white p-2">
        <calendar v-model="date.value" @change="handleMonthChange" @selected="handleDateChange" @heightchange="handleCalHeightChange" />
      </view>
    </z-paging>

    <!-- 浮窗展示账单列表 -->
    <wd-floating-panel :anchors="anchors" :content-draggable="false" @height-change="handelFloatingHeightChange">
      <z-paging ref="listPaging" v-model="groups" :height="`${pagingHeight && (pagingHeight - 32)}px`" :fixed="false" :refresher-enabled="false" :default-page-size="15" @query="handleListQuery">
        <bill-list-view :groups="groups" fixed-date-format />
      </z-paging>
    </wd-floating-panel>
  </view>

  <!-- 日期选择弹窗 -->
  <date-picker v-model="isDateSelectShow" v-model:date="date" />
</template>

<style lang="scss" scoped>
:deep(.wd-floating-panel) {
  z-index: 6;
}
:deep(.wd-floating-panel__header) {
  background-color: var(--wot-input-bg);
}

:deep(.wd-floating-panel__content) {
  background-color: var(--wot-input-bg);
}
</style>
