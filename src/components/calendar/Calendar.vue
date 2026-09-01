<script setup lang="ts">
import type { CalendarBillItem } from './CalendarView.vue'
import dayjs from 'dayjs'
import { getWeekLabel } from '@/utils'

defineOptions({
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared',
  },
})
const props = defineProps<{
  bills: Array<CalendarBillItem>
  month: number
}>()
const emit = defineEmits(['change', 'selected', 'heightchange'])
const date = defineModel<number>({ default: dayjs().valueOf() })

const { proxy } = getCurrentInstance() as any
const MAX_DATE = dayjs().valueOf()

const swiperHeight = ref(0)
const monthList = ref<number[]>([])
const oldIndex = ref(0)
const currentIndex = ref(0)
const currentMonth = ref(props.month)

// 周标题
const weekLabel = computed(() => {
  return (index: number) => {
    return getWeekLabel(index - 1)
  }
})

watch(() => date.value, (d) => {
  // 同一个月份不处理
  if (dayjs(currentMonth.value).isSame(dayjs(d), 'month'))
    return

  initMonthList(d)
  emit('selected', d)
  emit('change', currentMonth.value)
}, { immediate: true })

watch(() => props.month, (value) => {
  initMonthList(value)
  emit('change', currentMonth.value)
}, { immediate: true })

function initMonthList(baseDate = MAX_DATE) {
  const endOfBase = dayjs(baseDate).subtract(3, 'month').startOf('month')
  const months = Array.from({ length: 5 }, (_, i) => {
    return endOfBase.add(i + 1, 'month').startOf('month').valueOf()
  })

  monthList.value = months
  currentIndex.value = Math.floor(months.length / 2)
  oldIndex.value = currentIndex.value
  currentMonth.value = months[currentIndex.value]
  getSwiperItemHeight()
  console.log('initMonthList', monthList.value, currentIndex.value)
}
function handleDateChange(e: any) {
  // dateValue.value = e.value
  // currentIndex.value = 3
  const d = e.value
  date.value = d
  emit('selected', d)
}

function handleSwiperChange(e: any) {
  // console.log(e, 'change')
  oldIndex.value = currentIndex.value
  const index = e.detail.current
  const month = monthList.value[index]
  emit('change', month)
  currentMonth.value = month
  currentIndex.value = index
  // console.log(currentIndex.value, 'currentIndex.value')
  getSwiperItemHeight()
}

function handleSwiperAnimationFinish(e: any) {
  // console.log(e, currentIndex.value, 'animationfinish')
  // currentIndex.value = oldIndex.value
  // console.log(lodash.cloneDeep(monthList.value), 'handleSwiperChange')
  if (oldIndex.value < currentIndex.value) {
    // 向后滑动
    // 移除第一个月份swiper item, 并在末尾增加一个月份swiper item

    if (currentIndex.value >= monthList.value.length - 3) {
      console.log('新增日期项')
      const lastDate = monthList.value.at(-1)
      monthList.value.push(dayjs(lastDate).add(1, 'month').startOf('month').valueOf())
    }
    console.log('向后滑动', monthList.value)
  }
  else {
    // 向前滑动
    // 移除末尾一个月份swiper item, 并在开头增加一个月份swiper item
    if (currentIndex.value <= 2) {
      const firstDate = monthList.value.at(0)
      monthList.value.unshift(dayjs(firstDate).subtract(1, 'month').startOf('month').valueOf())
      // 插入前面，index发生改变，需要调整当前swiper current
      currentIndex.value += 1
      oldIndex.value = currentIndex.value
    }

    console.log('向前滑动', monthList.value)
  }
}

function getSwiperItemHeight() {
  const month = currentMonth.value
  // console.log('date', dayjs(month).format('YYYY-MM'))
  setTimeout(() =>
    uni
      .createSelectorQuery()
      .in(proxy)
      .select(`#calendar-view-${month}`)
      .boundingClientRect((view: any) => {
        // console.log(view, month, 'boundingClientRect')
        // 输出元素位置信息
        swiperHeight.value = view?.height ?? 399
        emitHeightChange(swiperHeight.value)
      })
      .exec(), 0)
}

function emitHeightChange(height: number) {
  emit('heightchange', height + 36) // 36 weeks height
}

function getBills(month: number) {
  return currentMonth.value === month ? props.bills : []
}
</script>

<template>
  <view class="calendar-weeks">
    <view v-for="item in 7" :key="item" class="calendar-week">
      {{ weekLabel(item) }}
    </view>
  </view>

  <swiper
    class="calendar-swiper"
    :current="currentIndex"
    :style="{ height: `${swiperHeight}px` }"
    :autoplay="false"
    :indicator="false"
    :circular="false"
    @change="handleSwiperChange"
    @animationfinish="handleSwiperAnimationFinish"
  >
    <swiper-item v-for="item in monthList" :key="item">
      <calendar-view :id="`calendar-view-${item}`" v-model="date" :month="item" :bills="getBills(item)" @change="handleDateChange" />
    </swiper-item>
  </swiper>
</template>

<style lang="scss" scoped>
.calendar-weeks {
  display: flex;
  height: 36px;
  line-height: 36px;
  color: rgba(0, 0, 0, 0.85);
  font-size: 16px;
  font-weight: bold;
}

.calendar-week {
  flex: 1 1 0%;
  text-align: center;
}

.calendar-swiper {
  transition: height 0.3s ease-in-out;
}
</style>
