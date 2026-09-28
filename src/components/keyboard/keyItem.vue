<script lang="ts" setup>
export interface Key {
  key: string | number // key值
  text?: string // key文本
  icon?: string // 图标
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
const emit = defineEmits(['press', 'longpress'])

function handleTap() {
  emit('press', props.value.key)
}
</script>

<template>
  <view
    class="keyboard-key-box"
    :class="[small ? 'keyboard-key-box-small' : '']"
    @tap="handleTap"
  >
    <view
      class="h-12 flex items-center justify-center rounded-lg bg-white text-lg font-semibold dark:bg-[var(--wot-dark-background3)]"
      :class="[props.value.emphasize ? 'keyboard-key-emphasize' : '']"
      hover-class="!bg-indigo-400 !dark:bg-indigo-600 !scale-94 transform-origin-center"
      :hover-start-time="0"
      :hover-stay-time="200"
    >
      <template v-if="value.icon">
        <wd-icon custom-class="keyboard-key-icon" :name="value.icon" :size="`${(value.key === 'delete' ? 22 : 17)}px`" />
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

.keyboard-key-emphasize {
  @apply: bg-indigo-300 dark:bg-indigo-500;
  font-weight: 400;
}

.keyboard-key-icon {
}
</style>
