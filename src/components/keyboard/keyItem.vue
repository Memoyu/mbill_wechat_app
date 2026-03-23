<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useTouch } from 'wot-design-uni'

export interface Key {
  key: string | number // key值
  text?: string // key文本
  emphasize?: boolean
}

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

function onTouchStart(event: TouchEvent) {
  touch.touchStart(event)
  active.value = true
}

function onTouchMove(event: TouchEvent) {
  touch.touchMove(event)
  if (touch.direction.value) {
    active.value = false
  }
}

function onTouchEnd() {
  if (active.value) {
    active.value = false
    emit('press', props.value.key)
  }
}
</script>

<script  lang="ts">
export default {
  options: {
    // 将自定义节点设置成虚拟的，更加接近Vue组件的表现
    virtualHost: true,
  },
}
</script>

<template>
  <view class="keyboard-key-box" :class="[small ? 'keyboard-key-box-small' : '']" @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd">
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
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  font-size: 17px;
  font-weight: bold;
  line-height: 1.5;
  background: rgb(255, 255, 255);
  border-radius: 8px;

  &:active {
    @apply: bg-indigo-300;
  }
}

.keyboard-key-emphasize {
  font-weight: 400;
  @apply: bg-indigo-300/20;
}

.keyboard-key-icon {
}
</style>
