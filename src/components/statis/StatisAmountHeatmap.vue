<script setup lang="ts">
import type { IBillSummaryAmount } from '@/api/types/bill'
import dayjs from 'dayjs'
import { billSecColors } from '@/constants/billIcons'
import { billOptions } from '@/typings'

interface CalendarMonthItem {
  start: number
  month: number
  days: number[]
  heats: number[]
}

const props = defineProps<{
  year: number
  data: IBillSummaryAmount
}>()

const type = ref(0)
const months = ref<CalendarMonthItem[]>([])
const bgColor = ref<string>(billSecColors[0])

watch(() => props.data, (newData) => {
  if (newData) {
    initCalendar(newData)
    // console.log(months.value, 'months')
  }
}, { deep: true })

watch(() => type.value, (val) => {
  // console.log(type.value, 'type')
  bgColor.value = !val || val < 0 ? '' : billSecColors[val]
  initCalendar(props.data)
})

function initCalendar(data: IBillSummaryAmount) {
  const year = dayjs(data.summary.date).year()
  months.value = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1
    const date = dayjs(`${year}-${month}-01`)
    const dayCount = date.daysInMonth()
    const day = date.day()
    const start = (day === 0 ? 7 : day)
    const days = Array.from({ length: dayCount }, (_, i) => i + 1)
    return { start, month, days, heats: getHeats(data.items[i]) } as CalendarMonthItem
  })
  console.log(months.value, 'months')
}
function getHeats(data: IBillSummaryAmount) {
  return data.items.map((i) => {
    const s = i.summary
    let heat = 0
    if (type.value === 0 && s.expend !== 0) {
      heat = s.expend / props.data.summary.expend
    }
    else if (type.value === 1 && s.income !== 0) {
      heat = s.income / props.data.summary.income
    }
    else if (type.value === 2 && s.income - s.expend !== 0) {
      heat = (s.income - s.expend) / props.data.summary.surplus
    }
    return heat === 0 ? 0 : Number.parseFloat((heat + 0.2).toFixed(2))
  })
}
</script>

<template>
  <view class="mb-4 flex items-center justify-between">
    <text class="font-semibold">
      收支热力图
    </text>
    <view>
      <mbill-segmented v-model="type" :options="[...billOptions, '结余']" />
    </view>
  </view>
  <view class="grid grid-cols-4 gap-2 py-3">
    <view v-for="m in months" :key="`month-${m.month}`">
      <view class="flex flex-col">
        <text>{{ m.month }}月</text>
        <view class="grid grid-cols-7 mt-2 gap-0.5">
          <view
            v-for="(d, didx) in m.days" :key="`day-${m.month}-${d}`"
            class="relative h-2.5 w-2.5 rounded bg-gray-200/60"
            :style="didx === 0 ? { gridColumnStart: `${m.start}` } : {}"
          >
            <view class="absolute inset-0 rounded" :style="`background-color:${bgColor};opacity:${m.heats[didx]}`" />
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
</style>
