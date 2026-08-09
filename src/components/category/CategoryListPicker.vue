<script setup lang="ts">
import type { ICategory } from '@/api/types/category'
import lodash from 'lodash'
import { useCategoryStore } from '@/store'
import { BillTypeEnum } from '@/typings'

defineOptions({
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared',
  },
})

const props = defineProps<{
  showSelectAll?: boolean
}>()
const emit = defineEmits(['confirm'])
const selecteds = defineModel<string[]>({ default: [] })
const visible = defineModel<boolean>('visible')

const categoryStore = useCategoryStore()

const typeActions = ref<string[]>([])
const type = ref(BillTypeEnum.Expend)
const expendPickerRef = ref()
const incomePickerRef = ref()
const isExpendAllSelected = ref()
const isIncomeAllSelected = ref()
const innerSelecteds = ref<string[]>([])

const expends = computed(() => categoryStore.expends)
const incomes = computed(() => categoryStore.incomes)
const isAllSelected = computed(() => {
  if (type.value === BillTypeEnum.Expend)
    return isExpendAllSelected.value
  else
    return isIncomeAllSelected.value
})

watch(() => selecteds.value, (newValue) => {
  if (newValue)
    innerSelecteds.value = lodash.cloneDeep(newValue)
}, { immediate: true, deep: true })

watch(() => visible.value, (newValue) => {
  // 重置选中项
  if (newValue) {
    innerSelecteds.value = lodash.cloneDeep(selecteds.value ?? [])
  }
})

function handleAfterEnter() {
  // console.log('handleAfterEnter')
  // 弹窗时赋值，确保分段组件能正常工作
  typeActions.value = ['支出', '收入']
  // expendPickerRef.value.toggleAll(true)
  // incomePickerRef.value.toggleAll(true)
}

function handleConfirm() {
  const selectCategories: ICategory[] = []

  // 支出分类中匹配
  expends.value.forEach((c) => {
    if (isSelected(c)) {
      selectCategories.push({ ...c })
    }
    c.childs?.forEach((cc) => {
      if (isSelected(cc)) {
        selectCategories.push({ ...cc, name: `${c.name}-${cc.name}` })
      }
    })
  })

  // 收入分类中匹配
  incomes.value.forEach((c) => {
    if (isSelected(c)) {
      selectCategories.push({ ...c })
    }
    c.childs?.forEach((cc) => {
      if (isSelected(cc)) {
        selectCategories.push({ ...cc, name: `${c.name}-${cc.name}` })
      }
    })
  })
  selecteds.value = innerSelecteds.value
  emit('confirm', selectCategories)
}

function isSelected(category: ICategory) {
  return innerSelecteds.value.includes(category.categoryId) || false
}

function handleChange(selecteds: string[]) {

}

function handleAllSelectClick() {
  if (type.value === BillTypeEnum.Expend) {
    expendPickerRef.value.selectAll(!isExpendAllSelected.value)
    isExpendAllSelected.value = !isExpendAllSelected.value
  }
  else {
    incomePickerRef.value.selectAll(!isIncomeAllSelected.value)
    isIncomeAllSelected.value = !isIncomeAllSelected.value
  }
}
</script>

<template>
  <bottom-popup v-model="visible" title="分类选择" @confirm="handleConfirm" @after-enter="handleAfterEnter">
    <template #action>
      <view class="flex items-center justify-between">
        <view class="max-w-max rounded-full bg-gray-200/50 px-3 py-1">
          <mbill-segmented v-model="type" :options="typeActions" />
        </view>
        <view
          v-if="showSelectAll"
          class="px-3 py-1 text-base text-gray-400"
          hover-class="bg-gray-50"
          :hover-start-time="0"
          :hover-stay-time="200"
          @tap="handleAllSelectClick"
        >
          <text>{{ isAllSelected ? '取消全选' : '全选' }}</text>
        </view>
      </view>
    </template>

    <!-- 分类列表 -->
    <view class="px-2">
      <wd-tabs v-model="type" animated>
        <wd-tab key="expend" title="支出" :name="BillTypeEnum.Expend">
          <list-picker-view
            v-if="visible && type === BillTypeEnum.Expend"
            ref="expendPickerRef"
            v-model="innerSelecteds"
            :list="expends"
            value-key="categoryId"
            custom-class="h-[50vh]"
            @change="handleChange"
          />
        </wd-tab>

        <wd-tab key="income" title="收入" :name="BillTypeEnum.Income">
          <list-picker-view
            v-if="visible && type === BillTypeEnum.Income"
            ref="incomePickerRef"
            v-model="innerSelecteds"
            :list="incomes"
            value-key="categoryId"
            custom-class="h-[50vh]"
            @change="handleChange"
          />
        </wd-tab>
      </wd-tabs>
    </view>
  </bottom-popup>
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
