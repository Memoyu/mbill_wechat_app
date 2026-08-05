<script setup lang="ts">
import type { ICategory } from '@/api/types/category'
import lodash from 'lodash'
import { useCategoryStore } from '@/store'

defineOptions({
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared',
  },
})

const props = defineProps<{

}>()
const emit = defineEmits(['confirm'])
const selecteds = defineModel<string[]>({ default: [] })
const visible = defineModel<boolean>('visible')

const categoryStore = useCategoryStore()
const categories = computed(() => categoryStore.expends)

const categoryPickerRef = ref()
const isAllSelected = ref()
const innerSelecteds = ref<string[]>([])

watch(() => selecteds.value, (newValue) => {
  if (newValue)
    innerSelecteds.value = lodash.cloneDeep(newValue)
}, { immediate: true, deep: true })

watch(() => visible.value, (newValue) => {
  // 重置选中项
  if (newValue) {
    categoryPickerRef.value.toggleAll(true)
    innerSelecteds.value = lodash.cloneDeep(selecteds.value ?? [])
  }
})

function handleAfterEnter() {
  // console.log('handleAfterEnter')
}

function handleConfirm() {
  const selectCategories: ICategory[] = []
  categories.value.forEach((c) => {
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
  categoryPickerRef.value.selectAll(isAllSelected.value)
  isAllSelected.value = !isAllSelected.value
}
</script>

<template>
  <bottom-popup v-model="visible" title="分类选择" @confirm="handleConfirm" @after-enter="handleAfterEnter">
    <template #action>
      <view
        class="px-3 py-1 text-base text-gray-400"
        hover-class="bg-gray-50"
        :hover-start-time="0"
        :hover-stay-time="200"
        @tap="handleAllSelectClick"
      >
        <text>{{ isAllSelected ? '取消全选' : '全选' }}</text>
      </view>
    </template>
    <!-- 分类列表 -->
    <view class="px-2">
      <list-picker-view
        ref="categoryPickerRef"
        v-model="innerSelecteds"
        :list="categories"
        value-key="categoryId"
        custom-class="h-[50vh]"
        @change="handleChange"
      />
    </view>
  </bottom-popup>
</template>

<style lang="scss" scoped>
:deep(.wd-collapse-item__header) {
  padding: 0;
  overflow: auto;
}
:deep(.wd-collapse-item__body) {
  padding: 0;
}
</style>
