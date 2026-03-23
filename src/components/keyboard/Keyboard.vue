<script lang="ts" setup>
import type { Key } from './keyItem.vue'

const emit = defineEmits(['press'])

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
  key: '^',
  text: '完成',
  emphasize: true,
}

function genBasicKeys(): Key[] {
  const keys: Key[] = Array.from({ length: 9 }, (_, i) => ({ key: i + 1 }))
  // 0：零, .：小数点, ~：再记
  keys.push({ key: 0 }, { key: '.' }, { key: '~', text: '再记', emphasize: true })
  return keys
}

function handleKeyPress(value) {
  console.log(value)
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
  background: var(--wot-color-gray-2, #f2f3f5);
  color: var(--wot-color-black, rgb(0, 0, 0));
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
