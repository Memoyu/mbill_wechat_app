<script lang="ts" setup>
let isInit = false

defineExpose({
  init,
})

function init() {
  if (isInit)
    return
  isInit = true
}
</script>

<template>
  <view>
    <view>自定义统计</view>
  </view>
</template>

<style lang="scss" scoped>
//
</style>
