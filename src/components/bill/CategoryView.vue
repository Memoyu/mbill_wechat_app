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
  height: number
}>()
const emit = defineEmits(['change'])
const selected = defineModel<string>()
const type = defineModel<number>('type')

const categoryStore = useCategoryStore()

const initTypes: number[] = []

const expends = ref<GridSelectData>({ tops: [], list: [] })
const incomes = ref<GridSelectData>({ tops: [], list: [] })

onMounted(() => {

})

watch(() => type.value, (t) => {
  if (t === undefined)
    return

  const categories = (t === 0 ? categoryStore.expends : categoryStore.incomes) || []

  // 常用分类
  const tops = (categories[0]?.childs || []).map((a) => {
    return {
      id: a.categoryId,
      name: a.name,
      icon: a.icon,
    } as GridSelectItem
  })
  // 分类列表
  const list = categories.map((a) => {
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

  // 是否已初始化过
  if (initTypes.includes(t)) {
    return
  }

  if (t === 0) {
    expends.value = { tops, list }
  }
  else {
    incomes.value = { tops, list }
  }
  initTypes.push(t)
}, { immediate: true })

function handleTabChange(change: any) {
  const { index } = change
  type.value = index
}

function handleCategoryItemTap(item: any) {
  // console.log('选中分类', item)
  const { select, parent } = item
  emit('change', { type: type.value, select, parent })
}
</script>

<template>
  <view>
    <wd-tabs v-model="type" animated swipeable @change="handleTabChange">
      <wd-tab key="expend">
        <grid-picker-view v-model="selected" :data="expends" :height="height" @change="handleCategoryItemTap" />
      </wd-tab>

      <wd-tab key="income">
        <grid-picker-view v-model="selected" :data="incomes" :height="height" @change="handleCategoryItemTap" />
      </wd-tab>
    </wd-tabs>
  </view>
</template>

<style lang="scss" scoped>
// 自定义tabs，隐藏nav
:deep(.wd-tabs) {
  background: none;
}
:deep(.wd-tabs__nav) {
  display: none;
}
</style>
