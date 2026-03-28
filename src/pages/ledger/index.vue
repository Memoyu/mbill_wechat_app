<script lang="ts" setup>
definePage({
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '账本管理',
  },
})
</script>

<template>
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
