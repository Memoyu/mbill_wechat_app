<script lang="ts" setup>
import type { ActionItem } from '@/typings'
import { safeAreaInsets } from '@/utils'

const props = defineProps<{
  title?: string
  actions?: ActionItem[]
}>()
function back() {
  uni.navigateBack()
}
</script>

<template>
  <view class="mb-backdrop-blur-bg sticky top-0 z-9 w-screen pb-3" :style="{ paddingTop: `${Math.max(safeAreaInsets.top, 28)}px` }">
    <view class="flex items-center gap-3 px-3 pt-3">
      <!-- 返回按钮 -->
      <view class="mb-active-bg h-8 w-8 flex items-center justify-center rounded-lg" @tap="back">
        <wd-icon name="left" size="18px" />
      </view>
      <!-- 标题/操作栏  -->
      <view class="w-full">
        <!-- 标题 -->
        <view class="w-[55vw] flex items-center justify-between text-16px font-semibold">
          <text v-if="title && title.length > 0"> {{ title }} </text>
          <slot v-else name="title" />
        </view>
        <!-- 操作按钮 -->
        <view class="mt-3 w-full flex items-center justify-start space-x-2">
          <slot name="prefix-action" />

          <view v-if="actions && actions.length > 0" class="flex items-center space-x-2">
            <view v-for="(item, index) in actions" :key="index + item.text" class="nav-bar-action-icon-box" @tap="item.action">
              <wd-icon :name="item.icon" />
              <text class="ml-2">{{ item.text }}</text>
            </view>
          </view>

          <slot name="suffix-action" />
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
</style>
