<script lang="ts" setup>
defineOptions({
  name: 'StartupLoading',
})

defineProps<{
  /** 进度百分比 0~100 */
  progress: number
  /** 当前加载状态文字 */
  statusText: string
  /** 是否加载失败 */
  failed: boolean
  /** 错误信息 */
  errorMsg: string
}>()

const emit = defineEmits(['retry'])
</script>

<template>
  <view class="startup-loading">
    <!-- Logo / 应用名 -->
    <view class="startup-logo">
      <view class="logo-icon">
        <text class="i-carbon-wallet text-4xl text-indigo-500" />
      </view>
      <text class="logo-text">记账本</text>
    </view>

    <!-- 加载中状态 -->
    <view v-if="!failed" class="startup-progress">
      <wd-progress :percentage="progress" />
      <text class="status-text">{{ statusText }}</text>
    </view>

    <!-- 加载失败状态 -->
    <view v-else class="startup-error">
      <view class="error-icon">
        <text class="i-carbon-warning-alt text-3xl text-red-400" />
      </view>
      <text class="error-msg">{{ errorMsg || '加载失败，请重试' }}</text>
      <wd-button
        block
        custom-class="retry-btn"
        @click="emit('retry')"
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

  .error-icon {
    width: 100rpx;
    height: 100rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: rgba(248, 113, 113, 0.1);
    margin-bottom: 8rpx;
  }

  .error-msg {
    font-size: 28rpx;
    color: #6b7280;
    text-align: center;
    line-height: 1.5;
  }

  .retry-btn {
    margin-top: 16rpx;
  }
}
</style>
