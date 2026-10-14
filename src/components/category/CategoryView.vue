<script setup lang="ts">
import type { GridPickerOption, GridPickerOptionItem } from '../base/GridPickerView/GridPickerView.vue'
import { getCategoryTop } from '@/api/category'
import { useCategoryStore } from '@/store'

defineOptions({
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared',
  },
})

const props = defineProps<{
  height: string
  showTop?: boolean
}>()
const emit = defineEmits(['change'])
const selected = defineModel<string>()
const type = defineModel<number>('type', { default: 0 })

const categoryStore = useCategoryStore()

const initTypes: number[] = []

const selectedExpend = ref('')
const selectedIncome = ref('')
const expendOption = ref<GridPickerOption>({ list: [] })
const incomeOption = ref<GridPickerOption>({ list: [] })

onMounted(() => {
})

watch(() => type.value, (t) => {
  initCategories(t)
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

function initCategories(t: number) {
// 是否已初始化过
  if (initTypes.includes(t))
    return

  const categories = (t === 0 ? categoryStore.expends : categoryStore.incomes) || []
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
    } as GridPickerOptionItem
  })
  initOption(list)

  // 常用分类
  if (props.showTop) {
    getCategoryTop(t).then((res) => {
      const tops = (res ?? []).map((a) => {
        return {
          id: a.categoryId,
          name: a.name,
          icon: a.icon,
        } as GridPickerOptionItem
      })
      initOption(list, tops)
    })
  }

  initTypes.push(t)
}

function initOption(list: GridPickerOptionItem[], tops?: GridPickerOptionItem[]) {
  if (type.value === 0) {
    expendOption.value = { list, tops }
    selectedExpend.value = tops?.[0]?.id || list[0]?.id || ''
  }
  else {
    incomeOption.value = { list, tops }
    selectedIncome.value = tops?.[0]?.id || list[0]?.id || ''
  }
}

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
  <wd-tabs v-model="type" animated swipeable @change="handleTabChange">
    <wd-tab key="expend">
      <grid-picker-view v-if="initTypes.includes(0)" v-model="selectedExpend" :scroll-height="height" :option="expendOption" @change="handleCategoryChange" />
    </wd-tab>

    <wd-tab key="income">
      <grid-picker-view v-if="initTypes.includes(1)" v-model="selectedIncome" :scroll-height="height" :option="incomeOption" @change="handleCategoryChange" />
    </wd-tab>
  </wd-tabs>
</template>

<style lang="scss">
// 自定义tabs，隐藏nav
:deep(.wd-tabs) {
  background: none;
}
:deep(.wd-tabs__nav) {
  display: none !important;
}
</style>
