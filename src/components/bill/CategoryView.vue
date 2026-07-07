<script setup lang="ts">
import type { GridSelectItem } from './GridPickerView/GridPickerView.vue'
import { useCategoryStore } from '@/store'

const props = defineProps<{
  type: number
  height: number
  selectId: string
}>()

const categoryStore = useCategoryStore()

const categories = ref<GridSelectItem[]>([])

onMounted(() => {
  initSelectItem()
})

function initSelectItem() {
  const cs = props.type === 0 ? categoryStore.expends : categoryStore.incomes
  categories.value = cs.map((a) => {
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
}

function handleCategoryItemTap(item: any) {
  console.log('选中分类', item)
}
</script>

<template>
  <view>
    <grid-picker-view :select-id="selectId" :list="categories" :height="height" @change="handleCategoryItemTap" />
  </view>
</template>

<style lang="scss" scoped>

</style>
