<script lang="ts" setup>
import { systemInfo } from '@/utils/systemInfo'

const props = defineProps<{

}>()
const { proxy } = getCurrentInstance() as any

let isInit = false
const scrollHeight = ref(0)
const options = ref()
const active = ref(0)

defineExpose({
  init,
})
function init() {
  if (isInit)
    return
  isInit = true
  options.value = getYears(new Date().getFullYear(), 20)
  getTopSegmentedHeight()
}

function getTopSegmentedHeight() {
  nextTick(() => {
    uni
      .createSelectorQuery()
      .select('#MAIN_SEGMENTED')
      .boundingClientRect((view: any) => {
        // console.log(view, 'MAIN_SEGMENTED')
        scrollHeight.value = view?.height ?? 89

        uni
          .createSelectorQuery()
          .in(proxy)
          .select('#ANNUAL_SEGMENTED')
          .boundingClientRect((view: any) => {
            // console.log(scrollHeight.value, view, 'ANNUAL_SEGMENTED')
            scrollHeight.value = systemInfo.windowHeight - (scrollHeight.value + (view?.height ?? 92))
            // console.log(scrollHeight.value, systemInfo.windowHeight, view?.height, 'ANNUAL_SEGMENTED')
          })
          .exec()
      })
      .exec()
  })
}

function handleScrollToLower() {
  const last = options.value[options.value.length - 1]
  options.value.push(...getYears(last))
}

function getYears(year: number, count = 10) {
  const dates = Array.from({ length: count }, (_, i) => {
    return (year + i).toString()
  })
  // console.log(dates, '2222')
  return dates
}
</script>

<template>
  <view
    id="ANNUAL_SEGMENTED"
    class="z-5 bg-white/70 pb-2 pt-3 backdrop-blur-md"
  >
    <view class="px-2">
      <mbill-segmented v-model="active" :options="options" @scrolltolower="handleScrollToLower">
        <template #content="{ option }">
          <view class="flex flex-col justify-center rounded-xl bg-indigo-500/40 px-3 py-4 text-white">
            <view class="flex items-end">
              <text class="text-base font-semibold">
                {{ option.value.substring(2) }}
              </text>
              <text>年</text>
            </view>
            <text class="text-center text-12px">{{ option.value.substring(0, 2) }}</text>
          </view>
        </template>
      </mbill-segmented>
    </view>
  </view>

  <scroll-view :style="{ height: `${scrollHeight}px` }" scroll-y>
    <view>内容</view>
  </scroll-view>
</template>

<style lang="scss" scoped>
//
</style>
