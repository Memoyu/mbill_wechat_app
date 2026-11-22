<script setup lang="ts">
import { normalizeClass } from 'vue'

defineOptions({
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<{
  value: boolean
  showBg?: boolean
  showCheck?: boolean
  position?: 'lt' | 'lc' | 'rc'
  customClass?: string
  checkClass?: string
}>(), {
  showCheck: true,
  showBg: true,
  position: 'rc',
  customClass: '',
  checkClass: '',
})

const checked = computed(() => props.value)

const rootClass = computed(() => {
  const clazz: Record<string, boolean> = {
    'absolute inset-0 overflow-hidden rounded-[inherit] transition-all duration-200': true,
    'bg-transparent': !checked.value,
    'ring-2 mb-selected-ring': checked.value,
    'mb-filled-bg': props.showBg && checked.value,
  }
  return normalizeClass([clazz, props.customClass])
})

const checkClass = computed(() => {
  const clazz: Record<string, boolean> = {
    'absolute h-6 w-6 bg-[var(--wot-primary-3)] flex animate-fade-in animate-duration-200 rounded-full shadow-sm text-white dark:text-gray-300 z-10': true,
    'items-end justify-end -left-2 -top-2': props.position === 'lt',
    'items-center justify-center inset-y-1/2 -translate-y-1/2 left-2': props.position === 'lc',
    'items-center justify-center inset-y-1/2 -translate-y-1/2 right-2': props.position === 'rc',
  }
  return normalizeClass([clazz, props.checkClass])
})
</script>

<template>
  <!-- 选中遮罩层 -->
  <view :class="rootClass">
    <!-- 选中状态的 check 图标 -->
    <view v-if="checked && showCheck" :class="checkClass">
      <view class="text-xs" :class="[position === 'lt' ? 'pb-0.2 pr-0.2' : '']">
        <text class="i-lucide-check" />
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
</style>
