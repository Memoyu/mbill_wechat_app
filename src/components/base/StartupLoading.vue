<script lang="ts" setup>
import { useStartupStore } from '@/store'

const startupStore = useStartupStore()
</script>

<template>
  <view class="startup-loading" :class="[!startupStore.loading ? 'fading' : '']">
    <!-- Logo / 应用名 -->
    <view class="startup-logo">
      <view class="logo-icon">
        <text class="i-lucide-wallet text-4xl text-indigo-500" />
      </view>
      <text class="logo-text">记账本</text>
    </view>

    <!-- 加载中状态 -->
    <view v-if="!startupStore.failed" class="startup-progress">
      <wd-progress :percentage="startupStore.progress" />
      <text class="status-text">{{ startupStore.statusText }}</text>
    </view>

    <!-- 加载失败状态 -->
    <view v-else class="startup-error">
      <text class="error-msg text-red-400">{{ startupStore.errorMsg || '加载失败，请重试' }}</text>
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
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 99999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #ffffff 0%, #f5f3ff 100%);
  opacity: 1;
  transition: opacity 0.4s ease-out;

  &.fading {
    opacity: 0;
    pointer-events: none;
  }
}

.startup-logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 60rpx;

  .logo-icon {
    width: 120rpx;
    height: 120rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 30rpx;
    background: rgba(99, 102, 241, 0.1);
    margin-bottom: 20rpx;
  }

  .logo-text {
    font-size: 36rpx;
    font-weight: 600;
    color: #1e1b4b;
    letter-spacing: 2rpx;
  }
}

.startup-progress {
  width: 60%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20rpx;

  .status-text {
    font-size: 24rpx;
    color: #6b7280;
  }
}

.startup-error {
  width: 70%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24rpx;

  .error-msg {
    font-size: 28rpx;
    text-align: center;
    line-height: 1.5;
  }

  .retry-btn {
    margin-top: 16rpx;
  }
}
</style>
