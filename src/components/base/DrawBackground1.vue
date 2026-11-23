<script lang="ts" setup>
defineOptions({
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared',
  },
})

const {
  isDark,
} = useTheme()

function getRbga(pre: boolean = true) {
  const rbg = isDark.value ? '255,255,255' : '0,0,0'
  return pre ? `rgba(${rbg},0.03)` : `rgba(${rbg},0.02)`
}
</script>

<template>
  <view class="relative w-screen transition-all -z-10">
    <view class="pointer-events-none fixed inset-0 overflow-hidden bg-[var(--wot-filled-content)]">
      <view
        v-for="i in 3"
        :key="`${i}-bg1`"
        class="absolute rounded-full bg-gray-900/[0.02] dark:bg-white/[0.05]"
        :style="{
          width: `${350 + i * 100}px`,
          height: `${350 + i * 100}px`,
          left: i === 1 ? '-5%' : i === 2 ? '105%' : '50%',
          top: i === 1 ? '-5%' : i === 2 ? '105%' : '65%',
          transform: `translate(-50%, -50%) rotate(${i * 45}deg)`,
          background:
            i === 1
              ? `linear-gradient(135deg, ${getRbga()}, ${getRbga(false)})`
              : i === 2
                ? `linear-gradient(225deg, ${getRbga()}, ${getRbga(false)})`
                : `linear-gradient(45deg, ${getRbga()}, ${getRbga(false)})`,
        }"
      />
    </view>
  </view>
</template>
