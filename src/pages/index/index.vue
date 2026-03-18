<script lang="ts" setup>
import { useToast } from 'wot-design-uni'

defineOptions({
  name: 'Home',
})
definePage({
  // 使用 type: "home" 属性设置首页，其他页面不需要设置，默认为page
  type: 'home',
  style: {
    // 'custom' 表示开启自定义导航栏，默认 'default'
    navigationStyle: 'custom',
    navigationBarTitleText: '首页',
  },
})

const lockScroll = ref(false)
provide('lockScroll', {
  lockScroll,
  updateLockScroll: (newValue) => {
    lockScroll.value = newValue
  },
})

onLoad(() => {
  console.log('测试 uni API 自动引入: onLoad')
})
</script>

<template>
  <page-meta :page-style="lockScroll ? 'overflow:hidden' : ''" />
  <view class="relative w-screen bg-white transition-all">
    <view class="pointer-events-none fixed inset-0 overflow-hidden">
      <view
        v-for="i in 3"
        :key="i"
        class="absolute rounded-full bg-gray-900/[0.02]"
        :style="{
          width: `${350 + i * 100}px`,
          height: `${350 + i * 100}px`,
          left: i === 1 ? '-5%' : i === 2 ? '105%' : '50%',
          top: i === 1 ? '-5%' : i === 2 ? '105%' : '65%',
          transform: `translate(-50%, -50%) rotate(${i * 45}deg)`,
          background:
            i === 1
              ? 'linear-gradient(135deg, rgba(0,0,0,0.02), rgba(0,0,0,0.01))'
              : i === 2
                ? 'linear-gradient(225deg, rgba(0,0,0,0.02), rgba(0,0,0,0.01))'
                : 'linear-gradient(45deg, rgba(0,0,0,0.02), rgba(0,0,0,0.01))',
        }"
      />
    </view>
    <view>222</view>
  </view>
</template>
