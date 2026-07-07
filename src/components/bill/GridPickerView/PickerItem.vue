<script setup lang="ts">
import type { GridSelectItem } from './GridPickerView.vue'

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
    <view class="grid-select-item-box-has-icon">
      <view :class="[hasChilds ? 'grid-select-parent-more' : '']">
        <bill-icon :icon="item.icon" :text="item.name" />
      </view>
      <view class="grid-select-item-title">
        {{ item.name }}
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.grid-select-parent-more {
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

.grid-select-item-box {
  @apply: font-bold rounded-lg py-3 px-2 bg-indigo-300/20;
}

.grid-select-item-box-has-icon {
  @apply: flex flex-col items-center py-2;
}

.grid-select-item-title {
  font-size: 12px;
  @apply: line-clamp-1 text-nowrap text-center;
}

.grid-select-item-selected {
  @apply: rounded-lg bg-indigo-300/30;
}
</style>
