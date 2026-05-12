<script lang="ts" setup>
definePage({
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '账单详情',
  },
})

const id = ref('')

onLoad((options) => {
  console.log('账单id', options.id)
})

function handleCreateTap() {
  console.log('handleCreateClick')
}
</script>

<template>
  <draw-background2 />
  <nav-bar id="TOP_NAVBAR">
    <!-- <template #title>
      <text> 账单详情 </text>
    </template> -->
    <template #action>
      <view class="flex items-center gap-3">
        <view class="nav-bar-action-icon-box" @tap="handleCreateTap">
          <wd-icon name="pen" />
          <text class="ml-2">编辑</text>
        </view>

        <view class="nav-bar-action-icon-box" @tap="handleCreateTap">
          <wd-icon name="delete" color="#F14646FF" />
          <text class="ml-2">删除</text>
        </view>
      </view>
    </template>
  </nav-bar>
  <view class="w-screen">
    <view class="mt-24 text-center">
      账单详情
    </view>·
  </view>
</template>

<style lang="scss" scoped>
//
</style>
