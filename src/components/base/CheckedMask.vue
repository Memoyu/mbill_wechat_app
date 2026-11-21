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
  position?: 'lt' | 'lc' | 'rc'
  customClass?: string
  checkClass?: string
}>(), {
  position: 'rc',
  customClass: '',
  checkClass: '',
})

const checked = computed(() => props.value)

const rootClass = computed(() => {
  const clazz: Record<string, boolean> = {
    'absolute inset-0 overflow-hidden rounded-md transition-all duration-200': true,
    'bg-transparent': !checked.value,
    'mb-filled-bg ring-2 mb-selected-ring': checked.value,
  }
  return normalizeClass([clazz, props.customClass])
})

const checkClass = computed(() => {
  const clazz: Record<string, boolean> = {
    'absolute h-5 w-5 mb-action-bg flex animate-fade-in animate-duration-200 rounded-full shadow-sm text-white dark:text-gray-300 z-10': true,
    'h-7 w-7 items-end justify-end -left-2.5 -top-2.5': props.position === 'lt',
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
    <view v-if="checked" :class="checkClass">
      <text class="i-lucide-check text-xs" :class="[position === 'lt' ? 'pb-2 pr-2' : '']" />
    </view>
  </view>
</template>

<style lang="scss" scoped>
</style>
