<script lang="ts" setup>
import type { Key } from './keyItem.vue'

defineOptions({
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared',
  },
})

const props = defineProps<{
  cursor: number
}>()
const emit = defineEmits(['press', 'update:cursor'])
const input = defineModel<string>()
// 数字键
const keys = computed(() => genBasicKeys())

// 运算符键
const opKeys: Key[] = [{
  key: '+',
  emphasize: true,
}, {
  key: '-',
  emphasize: true,
}, {
  key: '×',
  emphasize: true,
}, {
  key: '÷',
  emphasize: true,
}]

// 删除键
const delKey: Key = {
  key: 'delete',
  emphasize: true,
}
// 完成/提交键
const confirmKey: Key = {
  key: 'confirm',
  text: '完成',
  emphasize: true,
}

function genBasicKeys(): Key[] {
  const keys: Key[] = Array.from({ length: 9 }, (_, i) => ({ key: i + 1 }))
  // 0：零, .：小数点, custom：再记
  keys.push({ key: 0 }, { key: '.' }, { key: 'custom', text: '再记', emphasize: true })
  return keys
}

function handleKeyPress(key) {
  const value = input.value
  // console.log(props.cursor, 'cursor')

  if (key === 'custom' || key === 'confirm') {
    emit('press', key, value)
    return
  }

  if (key === 'delete') {
    // console.log(value)

    const newValue = value.slice(0, props.cursor - 1) + value.slice(props.cursor)
    emit('update:cursor', props.cursor - 1)
    input.value = newValue
  }
  else {
    const newValue = value.slice(0, props.cursor) + key + value.slice(props.cursor)
    emit('update:cursor', props.cursor + 1)
    input.value = newValue
  }

  emit('press', key, input.value)
}
</script>

<template>
  <view class="keyboard">
    <view class="keyboard-box">
      <view class="keyboard-basic-keys">
        <key-item v-for="value in keys" :key="value.key" :value="value" @press="handleKeyPress" />
      </view>
      <view class="keyboard-sidebar">
        <key-item :key="delKey.key" :value="delKey" @press="handleKeyPress" />
        <view class="keyboard-op-keys">
          <key-item v-for="value in opKeys" :key="value.key" small :value="value" @press="handleKeyPress" />
        </view>
        <key-item :key="confirmKey.key" :value="confirmKey" @press="handleKeyPress" />
      </view>
    </view>
  </view>
</template>

<style lang="scss">
.keyboard {
  @apply: bg-gray-100 dark:bg-[var(--wot-dark-background6)] text-black dark:text-white;
  -webkit-user-select: none;
  user-select: none;
}

.keyboard-box {
  display: flex;
  padding: 6px 0 0 6px;
}

.keyboard-basic-keys {
  display: flex;
  flex: 3;
  flex-wrap: wrap;
}

.keyboard-op-keys {
  display: flex;
  flex: 2;
  flex-wrap: wrap;
}

.keyboard-sidebar {
  display: flex;
  flex: 1;
  flex-direction: column;
}
</style>
