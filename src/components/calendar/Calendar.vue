<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { objToStyle } from '@/utils'
import { compareDate, getMonthEndDay } from '@/utils/date'

export interface CalendarDayItem {
  date: number
  text?: number | string
  topInfo?: string
  bottomInfo?: string
  disabled?: boolean
  isLastRow?: boolean
  type: string
}

export interface CalendarProps {
  /**
   * 日期
   */
  date: number
}
const props = defineProps<CalendarProps>()
const emit = defineEmits(['change'])
const modelValue = defineModel()
const days = ref<Array<CalendarDayItem>>([])
// const innerValue = ref()

// 计算偏移
const offset = computed(() => {
  const firstDayOfWeek = 0
  const offset = (7 + new Date(props.date).getDay() - firstDayOfWeek) % 7
  return offset
})

// 月第一天样式
const firstDayStyle = computed(() => {
  const dayStyle: CSSProperties = {}
  dayStyle.marginLeft = `${(100 / 7) * offset.value}%`
  return objToStyle(dayStyle)
})

const dayTypeClass = computed(() => {
  return (type: string) => {
    return `is-${type}`
  }
})

watch(
  [() => modelValue.value, () => props.date],
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
  const date = new Date(props.date)
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
      topInfo: '',
      bottomInfo: '',
      type,
    })
  }
  days.value = dayList
}

function getDateType(date: number) {
  if (modelValue.value && compareDate(date, modelValue.value as number) === 0) {
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
    modelValue.value = date.date
  }
}
</script>

<template>
  <view class="calendar rounded-2xl">
    <view class="calendar-days">
      <view
        v-for="(item, index) in days"
        :key="index"
        :class="`calendar-day ${item.disabled ? 'is-disabled' : ''} ${item.isLastRow ? 'is-last-row' : ''} ${
          item.type ? dayTypeClass(item.type) : ''
        }`"
        :style="index === 0 ? firstDayStyle : ''"
        @click="handleDateClick(index)"
      >
        <view class="calendar-day-box">
          <view class="calendar-day-text">
            {{ item.text }}
          </view>
          <view class="calendar-day-bottom">
            {{ item.bottomInfo }}
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped>
.calendar {
}

.calendar-days {
  display: flex;
  flex-wrap: wrap;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.85);
}

.calendar-day {
  position: relative;
  width: 14.285%;
  height: 54px;
  line-height: 54px;
  text-align: center;
}

.is-selected {
  border-radius: 8px;
  background: #4d80f0;
  color: rgb(255, 255, 255);
}

.calendar-day-box {
  position: relative;
  z-index: 2;
}

.calendar-day-text {
  font-weight: 500;
}

.calendar-day-bottom {
  position: absolute;
  bottom: 10px;
  left: 0;
  right: 0;
  line-height: 1.1;
  font-size: 10px;
  text-align: center;
}
</style>
