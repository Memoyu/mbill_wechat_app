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
  height: string
  showTop?: boolean
}>()
const emit = defineEmits(['change'])
const model = defineModel<string>({ default: '' })
const type = defineModel<number>('type', { default: 0 })

const categoryStore = useCategoryStore()

const expend = ref<string>('')
const income = ref<string>('')
const expendOption = computed(() => ({ list: categoryStore.expends, tops: props.showTop ? categoryStore.expTops : [] }))
const incomeOption = computed(() => ({ list: categoryStore.incomes, tops: props.showTop ? categoryStore.incTops : [] }))

// const currentId = computed(() => type.value === 0 ? selectedExpend.value : selectedIncome.value)

watch(() => model.value, (newValue) => {
  if (type.value === 0)
    expend.value = newValue
  else
    income.value = newValue
})

function handleTabChange(change: any) {
  const { index } = change
  type.value = index
  model.value = index === 0 ? expend.value : income.value // 设置当前选中分类
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

  if (select.type === type.value) {
    emit('change', { ...select, name })
  }
  // console.log('选中分类', item, expend.value, income.value)
}

function handleManage() {
  uni.navigateTo({ url: `/pages/category/index?type=${type.value}` })
}
</script>

<template>
  <wd-tabs v-model="type" animated swipeable @change="handleTabChange">
    <wd-tab key="expend">
      <grid-picker-view
        v-model="expend"
        :scroll-height="height"
        :option="expendOption"
        id-key="categoryId"
        @change="handleCategoryChange"
        @manage="handleManage"
      />
    </wd-tab>

    <wd-tab key="income">
      <grid-picker-view
        v-model="income"
        :scroll-height="height"
        :option="incomeOption"
        id-key="categoryId"
        @change="handleCategoryChange"
        @manage="handleManage"
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
