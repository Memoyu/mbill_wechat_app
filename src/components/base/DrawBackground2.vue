<script lang="ts" setup>
defineOptions({
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared',
  },
})
</script>

<template>
  <view class="relative w-screen transition-all">
    <view class="pointer-events-none fixed inset-0 overflow-hidden">
      <view
        v-for="i in 3"
        :key="`${i}-bg2`"
        class="absolute rounded-full bg-[var(--wot-primary-2)] opacity-60 dark:opacity-9"
        :style="{
          width: `${300 + i * 100}px`,
          height: `${300 + i * 100}px`,
          left: i === 1 ? '-10%' : i === 2 ? '110%' : '50%',
          top: i === 1 ? '-10%' : i === 2 ? '115%' : '50%',
          transform: `translate(-50%, -50%) rotate(${i * 45}deg)`,
        }"
      />
    </view>
  </view>
</template>
