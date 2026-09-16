<script setup lang="ts">
import dayjs from 'dayjs'
import { billSecColors } from '@/constants/billIcons'
import { getBillColor, getMonthEndDay } from '@/utils'

export interface CalendarDataItem {
  date: string
  expend: number
  income: number
  heat: number
}

interface CalendarDayItem {
  date: number
  text: number | string
  expend: number
  income: number
  heat: number
  disabled: boolean
}

const props = withDefaults(defineProps<{
  hmType: number // 热力图类型
  month: number
  data: Array<CalendarDataItem>
  highlight?: boolean
}>(), {
  highlight: true,
})
const emit = defineEmits(['change'])
const currentDate = defineModel<number>()
const days = ref<Array<CalendarDayItem>>([])

// 计算偏移
const offset = computed(() => {
  const day = dayjs(props.month).day()
  return (day === 0 ? 7 : day)
})

watch(() => props.month, () => {
  setDays()
}, { immediate: true })

watch(() => props.data, (data) => {
  days.value.forEach((day) => {
    const bill = data?.find(item => dayjs(item.date).isSame(dayjs(day.date), 'date'))
    if (!bill)
      return
    day.expend = bill.expend
    day.income = bill.income
    day.heat = bill.heat
  })
  // console.log('账单金额列表变更')
}, { deep: true, immediate: true })

function setDays() {
  const dayList: Array<CalendarDayItem> = []
  const date = new Date(props.month)
  const year = date.getFullYear()
  const month = date.getMonth()
  const totalDay = getMonthEndDay(year, month + 1)

  for (let day = 1; day <= totalDay; day++) {
    const date = new Date(year, month, day).getTime()

    dayList.push({
      date,
      text: day,
      expend: 0,
      income: 0,
      heat: 0,
      disabled: false,
    })
  }
  days.value = dayList
}

function handleSelectedDate(index: number) {
  const date = days.value[index]
  // console.log(date, '点击')
  if (date.disabled)
    return

  if (date.date !== currentDate.value) {
    emit('change', { value: date.date })
    currentDate.value = date.date
  }
}

function isCurrentDate(date: number) {
  return props.highlight && dayjs(currentDate.value).isSame(dayjs(date), 'date')
}

function getFormatAmount(amount: number) {
  const absAmount = Math.abs(amount)

  if (absAmount < 10000)
    return amount

  const units = [
    { value: 100000000, suffix: '亿' },
    { value: 10000, suffix: '万' },
  ]

  for (const unit of units) {
    if (absAmount >= unit.value) {
      const formatted = (amount / unit.value)
        .toFixed(2)
        .replace(/\.00$/, '')
        .replace(/(\.\d)0$/, '$1')
      return `${formatted}${unit.suffix}`
    }
  }

  return amount
}

function getHeatmapColor(type: number) {
  if (type < 0)
    return ''
  return billSecColors[type]
}
</script>

<template>
  <view class="relative rounded-2xl">
    <view class="grid grid-cols-7">
      <view
        v-for="(item, index) in days"
        :key="item.date"
        class="relative"
        :style="index === 0 ? { gridColumnStart: `${offset}` } : {}"
      >
        <view
          class="relative m-0.5 flex justify-center rounded-lg"
          :class="[isCurrentDate(item.date) ? 'calendar-selected-day' : '']"
          @tap="handleSelectedDate(index)"
        >
          <view class="flex flex-col items-center justify-center py-0.5">
            <view class="font-semibold">
              {{ item.text }}
            </view>
            <view class="h-8">
              <view v-if="item.expend !== 0 || item.income !== 0" class="flex flex-col items-center text-xs">
                <text :style="{ color: getBillColor(0) }">
                  {{ getFormatAmount(item.expend) }}
                </text>
                <text :style="{ color: getBillColor(1) }">
                  {{ getFormatAmount(item.income) }}
                </text>
              </view>
            </view>
          </view>
          <view class="absolute inset-0 z--1 rounded-lg" :style="{ opacity: item.heat, backgroundColor: getHeatmapColor(hmType) }" />
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped>
.calendar-selected-day {
  @apply: text-white bg-indigo-200;
}
</style>
