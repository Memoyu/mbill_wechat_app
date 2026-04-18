<script setup lang="ts">
import dayjs from 'dayjs'
import lodash from 'lodash'
import { getWeekLabel } from '@/utils/date'

const props = defineProps<{
}>()
const emit = defineEmits(['change'])
const date = defineModel<number>()

const INIT_HEIGHT = 290
const MAX_DATE = dayjs(dayjs().format('YYYY-MM-DD')).valueOf()
const { proxy } = getCurrentInstance() as any

const dateValue = ref(Date.now())
const swiperHeight = ref(INIT_HEIGHT)
const dateList = ref([])
const currentIndex = ref(0)
const oldIndex = ref(0)
const currentDate = ref()

// 周标题
const weekLabel = computed(() => {
  return (index: number) => {
    return getWeekLabel(index - 1)
  }
})

watch(() => date.value, (val) => {
  if (val === currentDate.value)
    return
  console.log(val, dateList.value[currentIndex.value])
  initDateList(dayjs(dayjs(val).format('YYYY-MM-DD')).valueOf())
})

onMounted(() => {
  initDateList()
})

function initDateList(baseDate = MAX_DATE) {
  const base = dayjs(baseDate)
  const endOfBase = base.subtract(3, 'month').startOf('month')

  const dates = Array.from({ length: 5 }, (_, i) => {
    return endOfBase.add(i + 1, 'month').startOf('month').valueOf()
  })

  dateList.value = dates
  currentIndex.value = Math.floor(dates.length / 2)
  oldIndex.value = currentIndex.value
  currentDate.value = dates[currentIndex.value]
  getSwiperItemHeight()
  // console.log('initDateList', swiperList.value, swiperIndex.value)
}
function handleDateChange(e) {
  // dateValue.value = e.value
  currentIndex.value = 3
}

function handleSwiperChange(e) {
  // console.log(e, 'change')
  oldIndex.value = currentIndex.value

  const index = e.detail.current
  const month = dateList.value[index]
  getSwiperItemHeight()
  emit('change', month)
  currentDate.value = month
  date.value = month
  currentIndex.value = index
  // console.log(currentIndex.value, 'currentIndex.value')
}

function handleSwiperAnimationFinish(e) {
  // console.log(e, currentIndex.value, 'animationfinish')
  // currentIndex.value = oldIndex.value
  tryAddSwiperItem()
}
function tryAddSwiperItem() {
  // console.log(lodash.cloneDeep(dateList.value), 'handleSwiperChange')
  if (oldIndex.value < currentIndex.value) {
    // 向后滑动
    // 移除第一个月份swiper item, 并在末尾增加一个月份swiper item

    if (currentIndex.value >= dateList.value.length - 3) {
      console.log('新增日期项')
      const lastDate = dateList.value.at(-1)
      dateList.value.push(dayjs(lastDate).add(1, 'month').startOf('month').valueOf())
    }
    console.log('向后滑动', dateList.value)
  }
  else {
    // 向前滑动
    // 移除末尾一个月份swiper item, 并在开头增加一个月份swiper item
    if (currentIndex.value <= 2) {
      const firstDate = dateList.value.at(0)
      dateList.value.unshift(dayjs(firstDate).subtract(1, 'month').startOf('month').valueOf())
      currentIndex.value += 1
      oldIndex.value = currentIndex.value
    }

    console.log('向前滑动', dateList.value)
  }
}
function getSwiperItemHeight() {
  const month = currentDate.value
  setTimeout(() =>
    uni
      .createSelectorQuery()
      .in(proxy)
      .select(`#calendar-view-${month}`)
      .boundingClientRect((view: UniApp.NodeInfo) => {
        // console.log(view, month, 'boundingClientRect')
        // 输出元素位置信息
        swiperHeight.value = view?.height ?? INIT_HEIGHT
      })
      .exec(), 0)
}
</script>

<template>
  <view class="calendar-weeks">
    <view v-for="item in 7" :key="item" class="calendar-week">
      {{ weekLabel(item) }}
    </view>
  </view>

  <swiper
    :current="currentIndex"
    :style="{ height: `${swiperHeight}px` }"
    :autoplay="false"
    :indicator="false"
    :circular="false"
    @change="handleSwiperChange"
    @animationfinish="handleSwiperAnimationFinish"
  >
    <swiper-item v-for="item in dateList" :key="item">
      <calendar-view :id="`calendar-view-${item}`" v-model="dateValue" class="calendar-content" :month="item" @change="handleDateChange" />
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
</style>
