<script setup lang="ts">
defineOptions({
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared',
  },
})

const props = defineProps<{
  item: any
  isSelected: boolean
  height: number
  cssIcon?: boolean
}>()

// const isSelected = computed(() => props.selected === props.item.id)
const hasChild = computed(() => props.item.childs && props.item.childs.length > 0)
</script>

<template>
  <view class="relative rounded-md" :style="{ height: `${height}px` }">
    <checked-mask :value="isSelected" position="lt" />
    <view class="h-full flex flex-col justify-center gap-1 px-1">
      <view class="flex justify-center">
        <view class="relative" :class="[hasChild ? 'grid-select-item-has-more' : '']">
          <bill-icon :icon="item.icon" :text="item.name" :css-icon="cssIcon" />
        </view>
      </view>
      <view class="truncate text-center text-xs">
        {{ item.name }}
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.grid-select-item-has-more {
  position: relative;
  &:before {
    content: '';
    position: absolute;
    right: -6px;
    bottom: 0;
    width: 9px;
    height: 9px;
    border-radius: 50%;
    z-index: 9;
    border: 2px solid white;
    @apply: dark:bg-[var(--wot-primary-9)] bg-[var(--wot-primary-6)];
  }
}
</style>
