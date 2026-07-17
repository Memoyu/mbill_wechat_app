<script setup lang="ts">
import type { GridSelectData, GridSelectItem } from './GridPickerView/GridPickerView.vue'
import { useCategoryStore } from '@/store'

defineOptions({
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared',
  },
})

const props = defineProps<{
  type: number
  height: number
}>()
const emit = defineEmits(['change'])
const selected = defineModel<string>()

const categoryStore = useCategoryStore()

const categoryData = ref<GridSelectData>({ tops: [], list: [] })

onMounted(() => {
  initSelectItem()
})

function initSelectItem() {
  const cs = (props.type === 0 ? categoryStore.expends : categoryStore.incomes) || []
  const tops = (cs[0]?.childs || []).map((a) => {
    return {
      id: a.categoryId,
      name: a.name,
      icon: a.icon,
    } as GridSelectItem
  })
  const categories = cs.map((a) => {
    return {
      id: a.categoryId,
      name: a.name,
      icon: a.icon,
      childs: (a.childs ?? []).map((c) => {
        return {
          id: c.categoryId,
          name: c.name,
          icon: c.icon,
        }
      }),
    } as GridSelectItem
  })
  categoryData.value = {
    list: categories,
    tops,
  }
}

function handleCategoryItemTap(item: any) {
  const { select, parent } = item
  console.log('选中分类', item, selected.value)
  emit('change', { type: props.type, select, parent })
}
</script>

<template>
  <view>
    <grid-picker-view v-model="selected" :data="categoryData" :height="height" @change="handleCategoryItemTap" />
  </view>
</template>

<style lang="scss" scoped>

</style>
