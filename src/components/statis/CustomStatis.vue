<script lang="ts" setup>
defineExpose({
  init,
})

const contentHeight = ref(0)
const paging = ref()

function init(height: number) {
  contentHeight.value = height
}

function handleQuery() {
  // console.log('handleQuery')
  paging.value.complete()
}
</script>

<template>
  <view :style="{ height: `${contentHeight}px` }" class="w-full">
    <z-paging ref="paging" :fixed="false" refresher-only @query="handleQuery">
      <template #top>
        <view>固定栏</view>
      </template>

      <view>自定义统计</view>
    </z-paging>
  </view>
</template>

<style lang="scss" scoped>
//
</style>
