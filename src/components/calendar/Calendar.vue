<script setup lang="ts">
import type { CalendarDataItem } from './CalendarView.vue'
import type { IBillSummaryAmount } from '@/api/types/bill.js'
import dayjs from 'dayjs'
import { useSettingsStore } from '@/store'
import { calcHeat } from '@/utils'

defineOptions({
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared',
  },
})
const props = defineProps<{
  data: IBillSummaryAmount
}>()
const emit = defineEmits(['change', 'selected', 'heightchange'])
const date = defineModel<number>({ default: dayjs().valueOf() })
const month = defineModel<number>('month', { default: dayjs().valueOf() })

const { proxy } = getCurrentInstance() as any

const swiperHeight = ref(0)
const monthList = ref<number[]>([])
const oldIndex = ref(0)
const currentIndex = ref(0)
const changed = ref(false)

const config = computed(() => useSettingsStore().calendar)
// 周标题
const weekLabels = ['一', '二', '三', '四', '五', '六', '日']

watch(() => date.value, (value) => {
  emit('selected', value)
  month.value = dayjs(value).startOf('month').valueOf()
  swipToDate(value)
})

watch(() => month.value, (value) => {
  emit('change', value)
  // 如果是当前月份，则不处理
  if (value === monthList.value[currentIndex.value])
    return
  swipToDate(value)
}, { immediate: true })

function swipToDate(date: number) {
  // 变更月份在列表中，则转到当前
  const monthIndex = monthList.value.findIndex(m => dayjs(m).isSame(dayjs(date), 'month'))
  if (monthIndex >= 0) {
    currentIndex.value = monthIndex
    oldIndex.value = currentIndex.value
    return
  }
  // 否则重新生成月份列表
  initMonthList(date)
}

function initMonthList(base: number) {
  const endOfBase = dayjs(base).subtract(3, 'month').startOf('month')
  const months = Array.from({ length: 5 }, (_, i) => {
    return endOfBase.add(i + 1, 'month').startOf('month').valueOf()
  })

  monthList.value = months
  currentIndex.value = Math.floor(months.length / 2)
  oldIndex.value = currentIndex.value

  calcSwiperItemHeight()
  // console.log('initMonthList', monthList.value, currentIndex.value)
}

function handleDateChange(e: any) {
  const { value } = e
  date.value = value
}

function handleSwiperChange(e: any) {
  // console.log(e, 'change')
  changed.value = true
  oldIndex.value = currentIndex.value
  const index = e.detail.current
  currentIndex.value = index
  month.value = monthList.value[index]

  calcSwiperItemHeight()
}

function handleSwiperAnimationFinish(e: any) {
  // 滑动完成，并且当前项变更，则处理月份列表
  if (!changed.value)
    return
  handleSwiperListChange()
}

function handleSwiperListChange() {
  // currentIndex.value = oldIndex.value
  // console.log(lodash.cloneDeep(monthList.value), 'handleSwiperChange')
  if (oldIndex.value < currentIndex.value) {
    // 向后滑动
    if (currentIndex.value >= monthList.value.length - 3) {
      // console.log('新增日期项')
      const lastDate = monthList.value.at(-1)
      monthList.value.push(dayjs(lastDate).add(1, 'month').startOf('month').valueOf())
    }
    // console.log('向后滑动', monthList.value)
  }
  else {
    // 向前滑动
    if (currentIndex.value <= 2) {
      const firstDate = monthList.value.at(0)
      monthList.value.unshift(dayjs(firstDate).subtract(1, 'month').startOf('month').valueOf())
      // 插入前面，index发生改变，需要调整当前swiper current
      currentIndex.value += 1
      oldIndex.value = currentIndex.value
    }
    // console.log('向前滑动', monthList.value)
  }
}

function calcSwiperItemHeight() {
  const month = monthList.value[currentIndex.value]
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
  if (monthList.value[currentIndex.value] !== month)
    return []

  const items = props.data.items.map((i) => {
    const item = i.summary
    return {
      date: item.date,
      expend: item.expend,
      income: item.income,
      heat: calcHeat(config.value.heatMap, props.data.summary, item),
    } as CalendarDataItem
  })
  // console.log(items, 'items')
  return items
}
</script>

<template>
  <view class="grid grid-cols-7 py-2 text-base font-semibold">
    <view v-for="item in weekLabels" :key="item" class="calendar-week">
      {{ item }}
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
      <calendar-view :id="`calendar-view-${item}`" v-model="date" :month="item" :hm-type="config.heatMap" :data="getBills(item)" @change="handleDateChange" />
    </swiper-item>
  </swiper>
</template>

<style lang="scss" scoped>
.calendar-week {
  flex: 1 1 0%;
  text-align: center;
}

.calendar-swiper {
  transition: height 0.3s ease-in-out;
}
</style>
