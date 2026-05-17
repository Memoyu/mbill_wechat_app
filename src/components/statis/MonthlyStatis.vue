<script lang="ts" setup>
import dayjs from 'dayjs'

let isInit = false
const options = ref()
const active = ref(0)

defineExpose({
  init,
})

function init() {
  if (isInit)
    return
  isInit = true
  options.value = getMonths()
}

function getMonths() {
  const dates = Array.from({ length: 20 }, (_, i) => {
    return dayjs().add(i, 'month').startOf('month').format('YYYY-MM')
  })
  // console.log(dates, '2222')
  return dates
}
</script>

<template>
  <view>
    <view class="px-2">
      <mbill-segmented v-model="active" :options="options">
        <template #content="{ option }">
          <view class="flex flex-col justify-center rounded-xl bg-indigo-500/40 px-3 py-2 text-white">
            <view class="flex items-end">
              <text class="text-base font-semibold">
                {{ option.value.substring(5) }}
              </text>
              <text>月</text>
            </view>
            <text class="text-12px">{{ option.value.substring(0, 4) }}</text>
          </view>
        </template>
      </mbill-segmented>
    </view>
  </view>
</template>

<style lang="scss" scoped>
//
</style>
