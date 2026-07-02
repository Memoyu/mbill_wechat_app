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
}>(), {
  color: 'inherit',
  size: '30px',
  shape: 'round',
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
    <image v-if="isImage" mode="aspectFill" :src="icon" :style="style" />
    <view v-else class="bill-icons" :class="[icon]" :style="style" />
  </view>
</template>

<style lang="scss" scoped>
.mbill-icon-box {
  // @apply bg-white;
}
</style>
