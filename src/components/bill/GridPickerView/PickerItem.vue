<script setup lang="ts">
import type { GridSelectItem } from './GridPickerView.vue'

defineOptions({
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared',
  },
})

const props = defineProps<{
  item: GridSelectItem
  selected: string
}>()
const emit = defineEmits(['change'])

const isSelected = computed(() => {
  return props.selected === props.item.id
})

const hasChilds = computed(() => {
  return props.item.childs && props.item.childs.length > 0
})
</script>

<template>
  <view :class="[isSelected ? 'grid-select-item-selected' : '']">
    <view class="grid-select-item-box">
      <view :class="[hasChilds ? 'grid-select-item-has-more' : '']">
        <bill-icon :icon="item.icon" :text="item.name" />
      </view>
      <view class="grid-select-item-title">
        {{ item.name }}
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.grid-select-item-box {
  @apply: flex flex-col items-center py-2;
}

.grid-select-item-has-more {
  position: relative;
  &:before {
    content: '';
    position: absolute;
    color: white;
    right: -6px;
    bottom: 0;
    width: 9px;
    height: 9px;
    border-radius: 50%;
    z-index: 9;
    border: 3px solid white;
    @apply: bg-indigo-300;
  }
}

.grid-select-item-title {
  font-size: 12px;
  @apply: line-clamp-1 text-nowrap text-center;
}

.grid-select-item-selected {
  @apply: rounded-lg bg-indigo-300/30;
}
</style>
