<script lang="ts" setup>
import { safeAreaInsets } from '@/utils/systemInfo'

function back() {
  uni.navigateBack()
}
</script>

<template>
  <view class="page-nav-bar" :style="{ paddingTop: `${Math.max(safeAreaInsets.top, 28)}px` }">
    <view class="flex items-center justify-between">
      <view class="flex-1">
        <view class="flex flex-col gap-1">
          <view class="flex items-center gap-3">
            <!-- 返回按钮 -->
            <view
              class="h-8 w-8 flex items-center justify-center rounded-lg bg-gray-50/80"
              hover-class="bg-gray-100/80 scale-95" :hover-start-time="0" :hover-stay-time="200"
              @tap="back"
            >
              <wd-icon name="thin-arrow-left" size="18px" class="text-gray-500" />
            </view>
            <!-- 标题/操作栏  -->
            <view class="flex flex-col gap-1">
              <!-- 标题 -->
              <view class="w-[50vw] flex items-center justify-between text-lg text-gray-800 font-semibold">
                <slot name="title" />
              </view>
              <!-- 操作按钮 -->
              <slot name="action" />
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.page-nav-bar {
  box-shadow: 0 3px 3px 0px rgba(0, 0, 0, 0.02);
  @apply: sticky top-0 z-99 bg-white/90 px-4 pb-3 pt-3 backdrop-blur-sm;
}
</style>
