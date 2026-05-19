<script lang="ts" setup>
const props = defineProps<{

}>()
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
  options.value = getYears(new Date().getFullYear(), 20)
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
  <view>
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
</template>

<style lang="scss" scoped>
//
</style>
