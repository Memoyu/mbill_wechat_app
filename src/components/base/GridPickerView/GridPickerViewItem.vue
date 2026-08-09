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
  height: number
  expand?: boolean
}>()

const isSelected = computed(() => {
  return props.selected === props.item.id
})

const hasChilds = computed(() => {
  return props.item.childs && props.item.childs.length > 0
})
</script>

<template>
  <view class="relative" :style="{ height: `${height}px` }">
    <view class="h-full flex flex-col justify-center gap-1 px-1">
      <view class="flex justify-center">
        <view class="relative" :class="[hasChilds ? 'grid-select-item-has-more' : '']">
          <bill-icon :icon="item.icon" :text="item.name" />
        </view>
      </view>
      <view class="truncate text-center text-xs">
        {{ item.name }}
      </view>
    </view>

    <!-- 选中遮罩层 -->
    <view
      class="absolute inset-0 z-10 overflow-hidden rounded-md transition-all duration-200"
      :class="[isSelected ? 'bg-indigo-500/10 ring-2 ring-indigo-500' : 'bg-transparent']"
    >
      <!-- 选中状态的 check 图标 -->
      <view
        v-if="isSelected"
        class="absolute h-7 w-7 flex animate-fade-in animate-duration-200 items-end justify-end rounded-full bg-indigo-500 shadow-sm -left-2.5 -top-2.5"
      >
        <text class="iconfont icon-check pb-0.5 pr-1 text-xs text-white" />
      </view>
    </view>

    <!-- 父项展开下标 -->
    <wd-icon
      v-if="expand && hasChilds"
      name="caret-down" :size="23"
      custom-class="text-indigo-500 absolute bottom-0 left-1/2 z-10 flex translate-y-full items-center justify-center -translate-x-1/2"
    />
  </view>
</template>

<style lang="scss" scoped>
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
</style>
