<script setup lang="ts">
import type { CSSProperties } from 'vue'
import dayjs from 'dayjs'
import { getBillColor, getMonthEndDay, objToStyle } from '@/utils'

export interface CalendarBillItem {
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

const props = defineProps<{
  month: number
  bills: Array<CalendarBillItem>
}>()
const emit = defineEmits(['change'])
const currentDate = defineModel<number>()
const days = ref<Array<CalendarDayItem>>([])

// 计算偏移
const offset = computed(() => {
  const firstDayOfWeek = 0
  const offset = (7 + new Date(props.month).getDay() - firstDayOfWeek) % 7
  return offset
})

// 月第一天样式
const firstDayStyle = computed(() => {
  const dayStyle: CSSProperties = {}
  dayStyle.marginLeft = `${(100 / 7) * offset.value}%`
  return objToStyle(dayStyle)
})

const dateMonth = computed(() => dayjs(props.month).format('YYYY年MM月'))

watch(() => props.month, () => {
  setDays()
}, { immediate: true })

watch(() => props.bills, (data) => {
  days.value.forEach((day) => {
    const bill = data.find(item => dayjs(item.date).isSame(dayjs(day.date), 'date'))
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
  return dayjs(currentDate.value).isSame(dayjs(date), 'date')
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
</script>

<template>
  <view class="calendar rounded-2xl">
    <view class="calendar-days">
      <!-- 调试时使用 -->
      <!-- <view class="calendar-month-text">
        {{ dateMonth }}
      </view> -->
      <view
        v-for="(item, index) in days"
        :key="index"
        class="calendar-day relative"
        :style="index === 0 ? firstDayStyle : ''"
      >
        <view
          class="calendar-day-content m-0.5 rounded-lg"
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
          <view class="absolute inset-0 z--1 rounded-lg bg-indigo-100" :style="{ opacity: item.heat }" />
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped>
.calendar {
  position: relative;
}

.calendar-days {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.85);
}

.calendar-day {
  position: relative;
  width: 14.2857%;
}
.calendar-day-content {
  position: relative;
  display: flex;
  justify-content: center;
}
.calendar-selected-day {
  color: white;
  @apply: bg-indigo-200;
}

.calendar-month-text {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, 0);
  white-space: nowrap;
  @apply: text-40px text-gray-200/60 font-semibold;
}
</style>
