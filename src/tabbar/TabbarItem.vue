<script setup lang="ts">
import type { CustomTabBarItem } from './types'
import { tabbarStore } from './store'

const props = defineProps<{
  item: CustomTabBarItem
  index: number
}>()

const isActive = computed(() => {
  return tabbarStore.curIdx === props.index
})
</script>

<template>
  <view class="flex items-center justify-center px-3 py-1.5 transition-colors">
    <!-- <view class="tabbar-item-text text-sm">
      {{ item.text }}
    </view> -->

    <view class="iconfont z-1 text-20px" :class="[item.icon, isActive ? 'shake-left-to-right' : '']" />
    <view v-if="isActive" class="iconfont icon-bg shake-right-to-left" :class="[`${item.icon}-filled`]" />
  </view>
</template>

<style scoped lang="scss">
.tabbar-item-text {
}
.icon-bg {
  @apply: absolute text-17px text-indigo-500/60;
  bottom: 6px;
  right: 8px;
}

/* 定义抖动动画 */
.shake-left-to-right {
  animation: shake-left-to-right 0.5s ease-in-out;
}

/* 定义抖动动画 */
.shake-right-to-left {
  animation: shake-right-to-left 0.5s ease-in-out;
}

@keyframes shake-left-to-right {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-2px);
  }
  75% {
    transform: translateX(2px);
  }
}

@keyframes shake-right-to-left {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(2px);
  }
  75% {
    transform: translateX(-2px);
  }
}
</style>
