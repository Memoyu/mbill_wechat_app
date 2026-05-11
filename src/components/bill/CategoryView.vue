<script setup lang="ts">
import { useCategoryStore } from '@/store'

const props = defineProps<{
  type: number
  height: number
}>()

const { proxy } = getCurrentInstance() as any
const categoryStore = useCategoryStore()

const categories = ref()

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
      childs: a.childs.map((c) => {
        return {
          id: c.categoryId,
          name: c.name,
          icon: c.icon,
        }
      }),
    }
  })
}

function handleCategoryItemTap(item: any) {
  console.log('选中分类', item)
}
</script>

<template>
  <view>
    <grid-select-view :list="categories" :height="height" @change="handleCategoryItemTap" />
  </view>
</template>

<style lang="scss" scoped>

</style>
