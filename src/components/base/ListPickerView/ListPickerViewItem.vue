<script setup lang="ts">
defineOptions({
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<{
  item: any
  shoeIcon?: boolean
  valueKey?: string
  labelKey?: string
  iconKey?: string
}>(), {
  shoeIcon: true,
  valueKey: 'id',
  labelKey: 'name',
  iconKey: 'icon',
})
const emit = defineEmits(['tap'])
const selecteds = defineModel<string[]>({ default: [] })

const isSelected = computed(() => {
  return selecteds.value.includes(props.item[props.valueKey]) || false
})
</script>

<template>
  <view class="relative flex items-center rounded-md bg-indigo-500/10 px-3 py-2" @tap.stop="emit('tap', item)">
    <view v-if="shoeIcon" class="mr-1">
      <bill-icon size="23" :icon="item[iconKey]" :text="item[labelKey]" />
    </view>
    <view class="flex-1 truncate text-sm">
      {{ item[labelKey] }}
    </view>
    <view
      class="absolute inset-0 z-10 overflow-hidden rounded-md transition-all duration-200"
      :class="[isSelected ? 'bg-indigo-500/10 ring-2 ring-indigo-500' : 'bg-transparent']"
    >
      <view
        v-if=" isSelected"
        class="absolute h-5 w-5 flex animate-fade-in animate-duration-200 items-end justify-end rounded-full bg-indigo-500 shadow-sm -left-2 -top-2"
      />
    </view>
  </view>
</template>

<style lang="scss" scoped>

</style>
