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
  '自定义1',
  '自定义2',
  '自定义3',
  '自定义4',
  '自定义5',
  '自定义6',
  '自定义7',
  '自定义8',
]

const active = ref(0)
</script>

<template>
  <draw-background2 />
  <view class="" :style="{ paddingTop: `${Math.max(safeAreaInsets.top, 28)}px` }">
    <view class="mt-2">
      <view class="rounded-full bg-gray-200/50 py-2">
        <mbill-segmented v-model="active" :options="options" />
      </view>
    </view>
    <!-- <view class="mx-3 mt-3">
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
    </view> -->
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
