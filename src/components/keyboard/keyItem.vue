<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useTouch } from 'wot-design-uni'

export interface Key {
  key: string | number // key值
  text?: string // key文本
  emphasize?: boolean
}

defineOptions({
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared',
  },
})
const props = defineProps<{
  small?: boolean
  value: Key
}>()
const emit = defineEmits(['press'])

const touch = useTouch()
const active = ref<boolean>(false)

const keyClass = computed(() => {
  return `keyboard-key ${props.value.emphasize ? 'keyboard-key-emphasize' : ''}`
})

function handleTouchStart(event: TouchEvent) {
  touch.touchStart(event)
  active.value = true
}

function handleTouchMove(event: TouchEvent) {
  touch.touchMove(event)
  if (touch.direction.value) {
    active.value = false
  }
}

function handleTouchEnd() {
  if (active.value) {
    active.value = false
    emit('press', props.value.key)
  }
}
</script>

<template>
  <view class="keyboard-key-box" :class="[small ? 'keyboard-key-box-small' : '']" @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd">
    <view :class="keyClass">
      <template v-if="value.key === 'delete'">
        <wd-icon custom-class="keyboard-key-icon" name="keyboard-delete" size="22px" />
      </template>
      <template v-else>
        {{ value.text || value.key }}
      </template>
    </view>
  </view>
</template>

<style lang="scss">
.keyboard-key-box {
  position: relative;
  flex: 1;
  flex-basis: 33%;
  box-sizing: border-box;
  padding: 0 6px 6px 0;
}

.keyboard-key-box-small {
  flex-basis: 50%;
}

.keyboard-key {
  @apply: bg-white dark:bg-[var(--wot-dark-background3)]
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  font-size: 17px;
  font-weight: bold;
  line-height: 1.5;
  border-radius: 8px;

  &:active {
    @apply: bg-indigo-400 dark:bg-indigo-600;
  }
}

.keyboard-key-emphasize {
  @apply: bg-indigo-300 dark:bg-indigo-500;
  font-weight: 400;
}

.keyboard-key-icon {
}
</style>
