<script lang="ts" setup>
import { safeAreaInsets } from '@/utils/systemInfo'

definePage({
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '账单统计',
  },
})
const options = [
  '月统计',
  '年统计',
  '自定义',
]
const monthlyStatisRef = ref()
const annualStatisRef = ref()
const customStatisRef = ref()

const active = ref(0)

watch(() => active.value, (val) => {
  initComponent(val)
})

onMounted(() => {
  initComponent(0)
})

function initComponent(cidx: number) {
  if (cidx === 0)
    monthlyStatisRef.value.init()
  else if (cidx === 1)
    annualStatisRef.value.init()
  else if (cidx === 2)
    customStatisRef.value.init()
}
</script>

<template>
  <draw-background2 />
  <view class="" :style="{ paddingTop: `${Math.max(safeAreaInsets.top, 28)}px` }">
    <view class="ml-3 mt-2 max-w-max rounded-full bg-gray-200/50 px-3 py-1">
      <mbill-segmented v-model="active" :options="options" />
    </view>

    <view class="mt-3">
      <wd-tabs v-model="active" swipeable animated>
        <wd-tab title="月统计" :name="0">
          <view>
            <monthly-statis ref="monthlyStatisRef" />
          </view>
        </wd-tab>

        <wd-tab title="年统计" :name="1">
          <view>
            <annual-statis ref="annualStatisRef" />
          </view>
        </wd-tab>

        <wd-tab title="自定义" :name="2">
          <view>
            <custom-statis ref="customStatisRef" />
          </view>
        </wd-tab>
      </wd-tabs>
    </view>
  </view>
</template>

<style lang="scss" scoped>
// 自定义tabs
:deep(.wd-tabs) {
  background: none;
}
:deep(.wd-tabs__nav) {
  display: none;
}
</style>
