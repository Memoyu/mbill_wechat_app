<script lang="ts" setup>
import { safeAreaInsets } from '@/utils/systemInfo'

defineOptions({
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared',
  },
})
</script>

<template>
  <!-- 顶部安全区 -->
  <wd-gap :height="Math.max(safeAreaInsets?.top, 28)" />
  <slot />
  <!-- 底部安全区 -->
  <wd-gap height="calc(32px + var(--wot-tabbar-height, 50px))" />
</template>
