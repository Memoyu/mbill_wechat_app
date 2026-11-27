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
  const pc = isDark.value ? 'var(--wot-primary-10)' : 'var(--wot-primary-1)'
  const sc = isDark.value ? 'var(--wot-primary-1)' : 'var(--wot-primary-5)'
  return pre ? pc : sc
}
</script>

<template>
  <view class="relative w-screen transition-all">
    <view class="pointer-events-none fixed inset-0 overflow-hidden">
      <view
        v-for="i in 3"
        :key="`${i}-bg1`"
        class="absolute rounded-full opacity-8"
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
