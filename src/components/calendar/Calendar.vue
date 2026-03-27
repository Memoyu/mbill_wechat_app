<script setup lang="ts">
import { getWeekLabel } from '@/utils/date'

const { proxy } = getCurrentInstance() as any

const dateValue = ref(Date.now())
const date = ref(1772294400000)
const swiperHeight = ref(290)
const swiperList = [
  '1772294400000',
  '1774972800000',
  '1777564800000',
]
const current = ref('1772294400000')

// 周标题
const weekLabel = computed(() => {
  return (index: number) => {
    return getWeekLabel(index - 1)
  }
})

onMounted(() => {
  nextTick(() => getSwiperItemHeight(0))
})

function handleDateChange(e) {
  // dateValue.value = e.value
}

function handleSwiperClick(item) {
  // console.log(item)
}

function handleSwiperChange(e) {
  console.log(e, 'change')
  getSwiperItemHeight(e.current)
}

function getSwiperItemHeight(item) {
  uni
    .createSelectorQuery()
    .in(proxy)
    .select(`#calendar-view-${swiperList[item]}`)
    .boundingClientRect((res: UniApp.NodeInfo) => {
      // console.log(res, 'boundingClientRect')
      // 输出元素位置信息
      const content = res
      swiperHeight.value = content?.height ?? 290
    })
    .exec()
}
</script>

<template>
  <view class="calendar-weeks">
    <view v-for="item in 7" :key="item" class="calendar-week">
      {{ weekLabel(item) }}
    </view>
  </view>

  <wd-swiper
    v-model="current"
    :height="swiperHeight"
    :autoplay="false"
    :indicator="false"
    :list="swiperList"
    @click="handleSwiperClick"
    @change="handleSwiperChange"
  >
    <template #default="{ item }">
      <calendar-view :id="`calendar-view-${item}`" v-model="dateValue" class="calendar-content" :month="Number(item)" @change="handleDateChange" />
    </template>
  </wd-swiper>
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
