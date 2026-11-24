<script lang="ts" setup>
import { useStartupStore } from '@/store'

const startupStore = useStartupStore()
</script>

<template>
  <view class="startup-loading fixed inset-0 z-999 flex flex-col items-center justify-center space-y-3" :class="[!startupStore.loading ? 'fading' : '']">
    <!-- Logo / 应用名 -->
    <view class="mb-6 flex items-center justify-center">
      <view class="flex flex-col">
        <image src="/static/images/logo-memo.png" class="ml-8 h-7 w-20" />
        <image src="/static/images/logo-bill.png" class="h-25 w-70" />
      </view>
    </view>

    <!-- 加载中状态 -->
    <view v-if="!startupStore.failed" class="w-60% flex flex-col items-center gap-2">
      <wd-progress :percentage="startupStore.progress" />
      <text class="status-text text-[var(--wot-text-secondary)]">{{ startupStore.statusText }}</text>
    </view>

    <!-- 加载失败状态 -->
    <view v-else class="flex flex-col items-center gap-2">
      <text class="text-[var(--wot-danger-main)]">{{ startupStore.errorMsg || '加载失败，请重试' }}</text>
      <wd-button
        block
        custom-class="retry-btn"
        @click="() => startupStore.startApp()"
      >
        重新登录
      </wd-button>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.startup-loading {
  background: linear-gradient(180deg, #ffffff 0%, #f5f3ff 100%);
  opacity: 1;
  transition: opacity 0.4s ease-out;

  &.fading {
    opacity: 0;
    pointer-events: none;
  }
}
</style>
