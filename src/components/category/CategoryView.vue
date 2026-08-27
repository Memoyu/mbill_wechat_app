<script setup lang="ts">
import type { GridSelectItem } from '../base/GridPickerView/GridPickerView.vue'
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
  height: number
  showTop?: boolean
}>()
const emit = defineEmits(['change'])
const selected = defineModel<string>()
const type = defineModel<number>('type', { default: 0 })

const categoryStore = useCategoryStore()

const initTypes: number[] = []

const selectedExpend = ref('')
const selectedIncome = ref('')
const expends = ref<GridSelectItem[]>([])
const incomes = ref<GridSelectItem[]>([])
const expendTops = ref<GridSelectItem[]>([])
const incomeTops = ref<GridSelectItem[]>([])

onMounted(() => {
  if (props.showTop) {
    getCategoryTop().then((res) => {
      expendTops.value = (res.expends ?? []).map((a) => {
        return {
          id: a.categoryId,
          name: a.name,
          icon: a.icon,
        } as GridSelectItem
      })
      incomeTops.value = (res.incomes ?? []).map((a) => {
        return {
          id: a.categoryId,
          name: a.name,
          icon: a.icon,
        } as GridSelectItem
      })
    })
  }
})

watch(() => type.value, (t) => {
  // 是否已初始化过
  if (initTypes.includes(t))
    return

  const categories = (t === 0 ? categoryStore.expends : categoryStore.incomes) || []
  let list: GridSelectItem[] = []

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
    expends.value = list
  }
  else {
    incomes.value = list
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
        <grid-picker-view v-if="initTypes.includes(0)" v-model="selectedExpend" :list="expends" :tops="expendTops" :scroll-height="height" @change="handleCategoryChange" />
      </wd-tab>

      <wd-tab key="income">
        <grid-picker-view v-if="initTypes.includes(1)" v-model="selectedIncome" :list="incomes" :tops="incomeTops" :scroll-height="height" @change="handleCategoryChange" />
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
