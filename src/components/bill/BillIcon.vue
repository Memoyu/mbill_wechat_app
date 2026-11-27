<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { addUnit, objToStyle } from '@wot-ui/ui/common/util'

defineOptions({
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<{
  icon?: string
  text?: string
  color?: string
  size?: string
  cssIcon?: boolean
}>(), {
  color: 'inherit',
  size: '32px',
})

const style = computed(() => {
  const style: CSSProperties = {}
  if (props.color) {
    style.color = props.color
  }
  if (props.size) {
    const sizeValue = addUnit(props.size)

    style.fontSize = `calc(${sizeValue} * 0.55)`
    style.width = sizeValue
    style.height = sizeValue
  }
  style['border-radius'] = '100%'

  return `${objToStyle(style)}`
})

const isImage = computed(() => !props.cssIcon && props.icon && props.icon.length > 0)
</script>

<template>
  <view :style="style" class="relative">
    <view class="bill-icon-box-bg" />
    <view class="absolute inset-0 flex items-center justify-center">
      <image v-if="isImage" mode="aspectFill" :src="icon" :style="style" :lazy-load="true" />
      <text v-else-if="cssIcon" class="iconfont bill-icon-text" :class="[icon]" />
      <text v-else class="bill-icon-text">{{ (text && text.length > 0) ? text.substring(0, 1) : '' }}</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.bill-icon-box-bg {
  position: absolute;
  inset: 0;
  background: var(--wot-primary-3);
  border-radius: inherit;
  opacity: 0.8;
}

.bill-icon-text {
  @apply text-white font-semibold dark:text-gray-300;
}
</style>
