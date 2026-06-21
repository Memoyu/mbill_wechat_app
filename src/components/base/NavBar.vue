<script lang="ts" setup>
import type { ActionItem } from '@/typings'
import { safeAreaInsets } from '@/utils/systemInfo'

const props = defineProps<{
  title?: string
  actions?: ActionItem[]
}>()
function back() {
  uni.navigateBack()
}
</script>

<template>
  <view class="page-nav-bar" :style="{ paddingTop: `${Math.max(safeAreaInsets.top, 28)}px` }">
    <view class="flex items-center gap-3 pt-3">
      <!-- 返回按钮 -->
      <view
        class="h-8 w-8 flex items-center justify-center rounded-lg bg-gray-50/80"
        hover-class="bg-gray-100/80 scale-95" :hover-start-time="0" :hover-stay-time="200"
        @tap="back"
      >
        <wd-icon name="left" size="18px" class="text-gray-500" />
      </view>
      <!-- 标题/操作栏  -->
      <view>
        <!-- 标题 -->
        <view class="w-[50vw] flex items-center justify-between text-16px text-gray-800 font-semibold">
          <text v-if="title && title.length > 0"> {{ title }} </text>
          <slot v-else name="title" />
        </view>
        <!-- 操作按钮 -->
        <view>
          <view v-if="actions && actions.length > 0">
            <view class="mt-3 flex items-center gap-3">
              <view v-for="(item, index) in actions" :key="index" class="nav-bar-action-icon-box" @tap="item.action">
                <wd-icon :name="item.icon" />
                <text class="ml-2">{{ item.title }}</text>
              </view>
            </view>
          </view>
          <slot v-else name="action" />
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.page-nav-bar {
  box-shadow: 0 3px 3px 0px rgba(0, 0, 0, 0.02);
  @apply: sticky top-0 z-9 bg-white/90 px-4 pb-3 backdrop-blur-sm;
}
</style>
