<template>
  <view class="relative w-screen bg-white transition-all -z-10">
    <view class="pointer-events-none fixed inset-0 overflow-hidden">
      <view
        v-for="i in 3"
        :key="i"
        class="absolute rounded-full bg-black/[0.015]"
        :style="{
          width: `${300 + i * 100}px`,
          height: `${300 + i * 100}px`,
          left: i === 1 ? '-10%' : i === 2 ? '110%' : '50%',
          top: i === 1 ? '-10%' : i === 2 ? '110%' : '50%',
          transform: `translate(-50%, -50%) rotate(${i * 45}deg)`,
        }"
      />
    </view>
  </view>
</template>
