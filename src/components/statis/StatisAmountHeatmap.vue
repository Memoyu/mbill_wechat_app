<script setup lang="ts">
import type { IBillSummaryAmount } from '@/api/types/bill'
import dayjs from 'dayjs'
import { billSecColors } from '@/constants/billIcons'
import { billOptions } from '@/typings'
import { calcHeat } from '@/utils'

interface CalendarMonthItem {
  offset: number
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
const showPopup = ref(false)
const month = ref()

watch(() => props.data, (newData) => {
  if (newData) {
    initCalendar(newData)
    // console.log(months.value, 'months')
  }
}, { deep: true })

watch(() => type.value, (val) => {
  // console.log(type.value, 'type')
  bgColor.value = val < 0 ? '' : billSecColors[val]
  initCalendar(props.data)
})

function initCalendar(data: IBillSummaryAmount) {
  const year = dayjs(data.summary.date).year()
  const ms = []
  for (let i = 0; i < 12; i++) {
    const month = i + 1
    const date = dayjs(`${year}-${month}-01`)
    const dayCount = date.daysInMonth()
    const day = date.day()
    const offset = (day === 0 ? 7 : day)
    const days = Array.from({ length: dayCount }, (_, i) => i + 1)
    ms.push({ offset, month, days, heats: getHeats(data.items[i]) })
  }
  months.value = ms
  // console.log(months.value, 'months')
}
function getHeats(data: IBillSummaryAmount) {
  return data.items.map((i) => {
    return calcHeat(type.value, props.data.summary, i.summary)
  })
}
function handleMonthTap(m: number) {
  showPopup.value = true
  month.value = m
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
  <view class="grid grid-cols-4 gap-2 px-1 py-3">
    <view v-for="m in months" :key="`month-${m.month}`">
      <view class="flex flex-col" @tap="handleMonthTap(m.month)">
        <text>{{ m.month }}月</text>
        <view class="grid grid-cols-7 mt-2 gap-0.5">
          <view
            v-for="(d, didx) in m.days" :key="`day-${m.month}-${d}`"
            class="relative h-2.5 w-2.5 rounded bg-gray-200/50"
            :style="didx === 0 ? { gridColumnStart: `${m.offset}` } : {}"
          >
            <view class="absolute inset-0 rounded" :style="`background-color:${bgColor};opacity:${m.heats[didx]}`" />
          </view>
        </view>
      </view>
    </view>
  </view>

  <!-- 热力图日历弹窗 -->
  <statis-amount-heatmap-popup v-model="showPopup" :year="year" :month="month" :data="data" />
</template>

<style lang="scss" scoped>
</style>
