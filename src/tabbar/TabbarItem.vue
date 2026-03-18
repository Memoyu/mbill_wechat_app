<script setup lang="ts">
import type { CustomTabBarItem } from './types'

const props = defineProps<{
  item: CustomTabBarItem
  index: number
}>()
</script>

<template>
  <view class="flex items-center justify-center px-3 py-1.5 transition-colors">
    <!-- <view class="tabbar-item-text text-sm">
      {{ item.text }}
    </view> -->
    <view class="text-20px" :class="[item.icon]" />
  </view>
</template>

<style scoped lang="scss">
.tabbar-item-text {
}
</style>
