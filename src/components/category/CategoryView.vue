<script setup lang="ts">
import type { GridSelectData, GridSelectItem } from '../base/GridPickerView/GridPickerView.vue'
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
const type = defineModel<number>('type', { default: 0 })

const categoryStore = useCategoryStore()

const initTypes: number[] = []

const selectedExpend = ref('')
const selectedIncome = ref('')
const expends = ref<GridSelectData>({ tops: [], list: [] })
const incomes = ref<GridSelectData>({ tops: [], list: [] })

onMounted(() => {

})

watch(() => type.value, (t) => {
  // 是否已初始化过
  if (initTypes.includes(t))
    return

  const categories = (t === 0 ? categoryStore.expends : categoryStore.incomes) || []
  let tops: GridSelectItem[] = []
  let list: GridSelectItem[] = []
  // 常用分类
  tops = (categories[0]?.childs || []).map((a) => {
    return {
      id: a.categoryId,
      name: a.name,
      icon: a.icon,
    } as GridSelectItem
  })

  // 分类列表
  list = categories.map((a) => {
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

  if (t === 0) {
    expends.value = { tops, list }
  }
  else {
    incomes.value = { tops, list }
  }
  initTypes.push(t)
  // console.log('分类初始化完成', t)
}, { immediate: true })

watch(() => selected.value, (s) => {
  if (!s)
    return

  if (type.value === 0)
    selectedExpend.value = s
  else
    selectedIncome.value = s
})

function handleTabChange(change: any) {
  const { index } = change
  type.value = index
}

function handleCategoryChange(item: any) {
  // console.log('选中分类', item)
  const { select, parent } = item

  let name = select.name
  if (parent) {
    name = `${parent.name}-${name}`
  }

  emit('change', {
    categoryId: select.id,
    name,
    icon: select.icon,
  })
}
</script>

<template>
  <view>
    <wd-tabs v-model="type" animated swipeable @change="handleTabChange">
      <wd-tab key="expend">
        <grid-picker-view v-if="initTypes.includes(0)" v-model="selectedExpend" :data="expends" :scroll-height="height" @change="handleCategoryChange" />
      </wd-tab>

      <wd-tab key="income">
        <grid-picker-view v-if="initTypes.includes(1)" v-model="selectedIncome" :data="incomes" :scroll-height="height" @change="handleCategoryChange" />
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
