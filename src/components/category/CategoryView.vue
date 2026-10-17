<script setup lang="ts">
import { useCategoryStore } from '@/store'

defineOptions({
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared',
  },
})

const props = defineProps<{
  value: string
  height: string
  showTop?: boolean
}>()
const emit = defineEmits(['change', 'update:value'])
const type = defineModel<number>('type', { default: 0 })

const categoryStore = useCategoryStore()

const expend = ref('')
const income = ref('')
const expendOption = computed(() => ({ list: categoryStore.expends, tops: props.showTop ? categoryStore.expTops : [] }))
const incomeOption = computed(() => ({ list: categoryStore.incomes, tops: props.showTop ? categoryStore.incTops : [] }))

// const currentId = computed(() => type.value === 0 ? selectedExpend.value : selectedIncome.value)

function handleTabChange(change: any) {
  const { index } = change
  type.value = index
}

function handleCategoryChange(item: any) {
  const { select, parent } = item

  if (select.type === 0)
    expend.value = select.categoryId
  else
    income.value = select.categoryId

  let name = select.name
  if (parent) {
    name = `${parent.name}-${name}`
  }

  // emit('update:value', select.categoryId)
  emit('change', select)
  console.log('选中分类', item, expend.value, income.value)
}
</script>

<template>
  <wd-tabs v-model="type" animated swipeable @change="handleTabChange">
    <wd-tab key="expend">
      <grid-picker-view
        :value="expend"
        :scroll-height="height"
        :option="expendOption"
        id-key="categoryId"
        @change="handleCategoryChange"
      />
    </wd-tab>

    <wd-tab key="income">
      <grid-picker-view
        :value="income"
        :scroll-height="height"
        :option="incomeOption"
        id-key="categoryId"
        @change="handleCategoryChange"
      />
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
