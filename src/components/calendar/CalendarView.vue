<script setup lang="ts">
import type { CSSProperties } from 'vue'
import dayjs from 'dayjs'
import { compareDate, getBillColor, getMonthEndDay, objToStyle } from '@/utils'

export interface CalendarDayItem {
  date: number
  text?: number | string
  expend?: number
  income?: number
  disabled?: boolean
  isLastRow?: boolean
  type: string
}

export interface CalendarProps {
  /**
   * 日期
   */
  month: number
}
const props = defineProps<CalendarProps>()
const emit = defineEmits(['change'])
const currentDate = defineModel()
const days = ref<Array<CalendarDayItem>>([])
// const innerValue = ref()

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

const dayTypeClass = computed(() => {
  return (type: string) => {
    return `is-${type}`
  }
})

watch(
  [() => currentDate.value, () => props.month],
  () => {
    setDays()
  },
  {
    deep: true,
    immediate: true,
  },
)

function setDays() {
  const dayList: Array<CalendarDayItem> = []
  const date = new Date(props.month)
  const year = date.getFullYear()
  const month = date.getMonth()
  const totalDay = getMonthEndDay(year, month + 1)

  for (let day = 1; day <= totalDay; day++) {
    const date = new Date(year, month, day).getTime()
    let type = getDateType(date)
    if (!type && compareDate(date, Date.now()) === 0) {
      type = 'current'
    }
    dayList.push({
      date,
      text: day,
      expend: day % 2 === 0 ? 100 : 0,
      income: 0,
      type,
    })
  }
  days.value = dayList
}

function getDateType(date: number) {
  if (currentDate.value && compareDate(date, currentDate.value as number) === 0) {
    return 'selected'
  }
  return ''
}

function handleDateClick(index: number) {
  const date = days.value[index]
  // console.log(date, '点击')
  if (date.disabled)
    return

  if (date.type !== 'selected') {
    emit('change', { value: date.date })
    currentDate.value = date.date
  }
}
</script>

<template>
  <view class="calendar rounded-2xl">
    <view class="calendar-days">
      <view class="calendar-month-text">
        {{ dateMonth }}
      </view>
      <view
        v-for="(item, index) in days"
        :key="index"
        class="calendar-day"
        :class="[item.disabled ? 'is-disabled' : '', item.isLastRow ? 'is-last-row' : '', item.type ? dayTypeClass(item.type) : '']"
        :style="index === 0 ? firstDayStyle : ''"
        @tap="handleDateClick(index)"
      >
        <view class="flex flex-col items-center justify-center py-0.5">
          <view class="font-semibold">
            {{ item.text }}
          </view>
          <view class="h-8">
            <view v-if="item.expend !== 0 || item.income !== 0" class="flex flex-col items-center text-xs">
              <text :style="{ color: getBillColor(0) }">
                {{ item.expend }}
              </text>
              <text :style="{ color: getBillColor(1) }">
                {{ item.income }}
              </text>
            </view>
          </view>
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
  width: 14.285%;
  display: flex;
  justify-content: center;
  items-align: center;
}

.is-selected {
  border-radius: 8px;
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
