<script lang="ts" setup>
const props = defineProps<{

}>()

const contentHeight = ref(0)
const options = ref()
const active = ref(0)
const paging = ref()

defineExpose({
  init,
})
function init(height: number) {
  contentHeight.value = height
  options.value = getYears(new Date().getFullYear(), 20)
}

function handleScrollToLower() {
  const last = options.value[options.value.length - 1]
  options.value.push(...getYears(last))
}

function getYears(year: number, count = 10) {
  const dates = Array.from({ length: count }, (_, i) => {
    return (year - i).toString()
  })
  // console.log(dates, '2222')
  return dates
}

function handleQuery() {
  // console.log('handleQuery')
  paging.value.complete()
}
</script>

<template>
  <view :style="{ height: `${contentHeight}px` }" class="w-full">
    <z-paging ref="paging" :fixed="false" refresher-only @query="handleQuery">
      <template #top>
        <view class="70 z-5 backdrop-blur-md" bg-white pb-2 pt-3>
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

      <view>内容</view>
    </z-paging>
  </view>
</template>

<style lang="scss" scoped>
//
</style>
