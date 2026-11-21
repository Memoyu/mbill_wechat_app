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
const selecteds = defineModel<string[]>({ default: () => [] })

const isSelected = computed(() => selecteds.value.includes(props.item[props.valueKey]) || false)
</script>

<template>
  <view class="mb-filled-bg relative flex items-center rounded-md px-3 py-2" @tap.stop="emit('tap', item)">
    <view v-if="shoeIcon" class="z-1 mr-2">
      <bill-icon size="23" :icon="item[iconKey]" :text="item[labelKey]" />
    </view>
    <view class="flex-1 truncate text-sm">
      {{ item[labelKey] }}
    </view>

    <checked-mask :value="isSelected" />
  </view>
</template>

<style lang="scss" scoped>

</style>
