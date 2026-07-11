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

    style.fontSize = `calc(${sizeValue} * 0.60)`
    style.width = sizeValue
    style.height = sizeValue
  }
  style['border-radius'] = '100%'

  return `${objToStyle(style)}`
})

const isImage = computed(() => {
  return props.icon && props.icon.length > 0
})
</script>

<template>
  <view :style="style" class="category-icon-box" :class="[isImage ? '' : 'bg-indigo-300/40']">
    <image v-if="isImage" mode="aspectFill" :src="icon" :style="style" :lazy-load="true" />
    <text v-else class="text-white font-semibold">{{ (text && text.length > 0) ? text.substring(0, 1) : '' }}</text>
  </view>
</template>

<style lang="scss" scoped>
.category-icon-box {
  @apply shrink-0 flex justify-center items-center;
}
</style>
