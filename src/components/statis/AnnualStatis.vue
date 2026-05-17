<script lang="ts" setup>
import dayjs from 'dayjs'

const options = ref()
const active = ref(0)

onMounted(() => {
  options.value = getYears()
})

function getYears() {
  const dates = Array.from({ length: 20 }, (_, i) => {
    return (new Date().getFullYear() + i).toString()
  })
  // console.log(dates, '2222')
  return dates
}
</script>

<template>
  <view>
    <view>
      <mbill-segmented v-model="active" :options="options">
        <template #content="{ option }">
          <view class="flex flex-col justify-center rounded-xl bg-indigo-500/40 px-3 py-2 text-white">
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
