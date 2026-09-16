<script setup lang="ts">
import type { CalendarDataItem } from '../calendar/CalendarView.vue'
import type { IBillSummaryAmount } from '@/api/types/bill'
import dayjs from 'dayjs'
import { billOptions } from '@/typings'
import { calcHeat, systemInfo } from '@/utils'

interface CalendarMonthItem {
  label: string
  month: number
}

const props = withDefaults(defineProps<{
  year: number
  data: IBillSummaryAmount
  month?: number
}>(), {
  month: 1,
})

const { proxy } = getCurrentInstance() as any
const scrollHeight = 70

const show = defineModel<boolean>()

const mounted = ref(false)
const segMounted = ref(false)
const type = ref(0)
const months = ref<CalendarMonthItem[]>([])
const caleData = ref<Array<CalendarDataItem[]>>([])
const targetScroll = ref(0)
const monthTops = ref<number[]>([])

// 周标题
const weekLabels = ['一', '二', '三', '四', '五', '六', '日']

watch(() => show.value, (newVal) => {
  if (newVal) {
    mounted.value = true
  }
})

watch(() => props.data, (newData) => {
  if (newData) {
    initCalendar(newData)
    // console.log(months.value, 'months')
  }
}, { deep: true })

watch(() => props.month, (m) => {
  targetScroll.value = monthTops.value[m - 1]
})

function handleAfterEnter() {
  // console.log(months.value, 'months')
  segMounted.value = true
  if (monthTops.value.length < 1) {
    uni
      .createSelectorQuery()
      .in(proxy)
      .selectAll('.heat-map-month-title')
      .boundingClientRect((views: any) => {
        console.log(views, props.month, dayjs(props.month).format('YYYY-MM-DD'), 'boundingClientRect')

        if (!views || views.length < 1)
          return
        const baseTop = views[0].top
        for (let i = 0; i < views.length; i++) {
          const view = views[i]
          monthTops.value.push(view.top - baseTop)
        }
        targetScroll.value = monthTops.value[props.month - 1]
      })
      .exec()
  }
}

function initCalendar(data: IBillSummaryAmount) {
  const year = dayjs(data.summary.date).year()
  const ms = []
  for (let i = 0; i < 12; i++) {
    const m = dayjs(`${year}-${i + 1}-01`)
    ms.push({ label: m.format('YYYY年MM月'), month: m.valueOf() })
  }
  months.value = ms
  // console.log(months.value, 'months')
  caleData.value = props.data.items.map((m) => {
    return getBillData(m)
  })

  // console.log(caleData.value, 'caleData')
}
function getBillData(data: IBillSummaryAmount) {
  return data.items.map((item) => {
    const { date, expend, income } = item.summary
    const heat = calcHeat(type.value, props.data.summary, item.summary)
    return { date, expend, income, heat } as CalendarDataItem
  })
}
</script>

<template>
  <bottom-popup v-if="mounted" v-model="show" auto-height title="收支热力图" :show-btn="false" @after-enter="handleAfterEnter">
    <template #action>
      <view class="flex items-center justify-between">
        <view class="max-w-max rounded-full bg-gray-200/50 px-3 py-1">
          <mbill-segmented v-if="segMounted" v-model="type" :options="[...billOptions, '结余']" />
        </view>
      </view>
    </template>
    <template #title>
      <view class="grid grid-cols-7 px-3 py-2 font-semibold">
        <view v-for="item in weekLabels" :key="item" class="text-center">
          {{ item }}
        </view>
      </view>
    </template>
    <view class="px-3">
      <scroll-view
        :class="`h-${scrollHeight}vh`"
        scroll-y
        :show-scrollbar="false"
        scroll-with-animation
        :scroll-top="targetScroll"
      >
        <view v-for="(m, idx) in months" :key="m.month" class="flex flex-col gap-2">
          <text class="heat-map-month-title font-semibold">{{ m.label }}</text>
          <calendar-view :month="m.month" :data="caleData[idx]" :highlight="false" :hm-type="type" />
        </view>
      </scroll-view>
    </view>
  </bottom-popup>
</template>

<style lang="scss" scoped>
</style>
