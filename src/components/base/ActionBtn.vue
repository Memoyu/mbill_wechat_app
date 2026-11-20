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
  customClass?: string
}>(), {
  customClass: '',
})

const rootClass = computed(() => {
  const clazz: Record<string, boolean> = {
    'w-fit rounded-full mb-action-bg p-2 font-semibold backdrop-blur-sm transition-all': true,
  }
  return normalizeClass([clazz, props.customClass])
})
</script>

<template>
  <view
    :class="rootClass"
    class="container"
    hover-class="!scale-97 transform-origin-center"
    :hover-start-time="0"
    :hover-stay-time="200"
  >
    <slot />
  </view>
</template>

<style lang="scss" scoped>
.container {
  display: inherit;
}
</style>
