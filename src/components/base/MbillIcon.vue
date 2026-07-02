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
  icon: string
  color?: string
  size?: string
  shape?: 'round' | 'square'
  family?: string
}>(), {
  color: 'inherit',
  size: '30px',
  shape: 'round',
  family: 'bill-icons',
})

const innerIcon = computed(() => {
  if (props.icon.includes('/')) {
    return props.icon
  }
  else {
    return `${props.family} ${props.icon}`
  }
})

const style = computed(() => {
  const style: CSSProperties = {}
  if (props.color) {
    style.color = props.color
  }
  if (props.size) {
    const sizeValue = addUnit(props.size)
    style['font-size'] = sizeValue

    style.width = sizeValue
    style.height = sizeValue
  }

  if (props.shape === 'square') {
    style['border-radius'] = '4px'
  }
  else {
    style['border-radius'] = '100%'
  }

  return `${objToStyle(style)}`
})

const isImage = computed(() => {
  return props.icon.includes('/')
})
</script>

<template>
  <view :style="style" class="mbill-icon-box">
    <image v-if="isImage" mode="aspectFill" :src="innerIcon" :style="style" />
    <view v-else :class="[innerIcon]" :style="style" />
  </view>
</template>

<style lang="scss" scoped>
.mbill-icon-box {
  // @apply bg-white;
}
</style>
