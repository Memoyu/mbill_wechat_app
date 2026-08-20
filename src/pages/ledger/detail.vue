<script lang="ts" setup>
definePage({
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '账本详情',
  },
})

const editShow = ref(false)
</script>

<template>
  <page-meta :page-style="`overflow:${editShow ? 'hidden' : 'visible'};`" />
  <draw-background2 />
  <nav-bar id="TOP_NAVBAR" title="账本详情" />
  <view class="">
    <view>
      账本详情
    </view>
  </view>
</template>
