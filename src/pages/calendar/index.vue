<script lang="ts" setup>
definePage({
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '账单日历',
  },
})

const lockScroll = ref(false)
provide('lockScroll', {
  lockScroll,
  updateLockScroll: (newValue) => {
    lockScroll.value = newValue
  },
})
</script>

<template>
  <page-meta :page-style="lockScroll ? 'overflow:hidden' : ''" />
  <draw-background2 />
  <nav-bar />
  <!-- 日历组件 -->
  <view class="mx-3 mt-3 rounded-3xl bg-white/70 px-3">
    <calendar />
  </view>
</template>

<style lang="scss" scoped>
//
</style>
