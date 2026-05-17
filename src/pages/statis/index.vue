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

const active = ref(0)
</script>

<template>
  <draw-background2 />
  <view class="" :style="{ paddingTop: `${Math.max(safeAreaInsets.top, 28)}px` }">
    <view class="ml-3 mt-2 max-w-max rounded-full bg-gray-200/50 py-1">
      <mbill-segmented v-model="active" :options="options" />
    </view>

    <view class="mt-3">
      <wd-tabs v-model="active" swipeable animated>
        <wd-tab title="月统计" :name="0">
          <view>
            <monthly-statis />
          </view>
        </wd-tab>

        <wd-tab title="年统计" :name="1">
          <view>
            <annual-statis />
          </view>
        </wd-tab>

        <wd-tab title="自定义" :name="2">
          <view>
            <custom-statis />
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
