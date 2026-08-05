<script setup lang="ts">
import type { ITag } from '@/api/types/tag'
import lodash from 'lodash'
import { useTagStore } from '@/store'

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

const tagStore = useTagStore()
const tags = computed(() => tagStore.tags)

const tagPickerRef = ref()
const isAllSelected = ref()
const innerSelecteds = ref<string[]>([])

watch(() => selecteds.value, (newValue) => {
  if (newValue)
    innerSelecteds.value = lodash.cloneDeep(newValue ?? [])
}, { immediate: true, deep: true })

watch(() => visible.value, (newValue) => {
  // 默认全部展开
  if (newValue) {
    tagPickerRef.value?.toggleAll(true)
    innerSelecteds.value = lodash.cloneDeep(selecteds.value ?? [])
  }
})

function handleAfterEnter() {
  // console.log('handleAfterEnter')
}

function handleConfirm() {
  const selectTags: ITag[] = []
  tags.value.forEach((t) => {
    if (isSelected(t)) {
      selectTags.push({ ...t })
    }
    t.childs?.forEach((ct) => {
      if (isSelected(ct)) {
        selectTags.push({ ...ct, name: `${t.name}-${ct.name}` })
      }
    })
  })
  selecteds.value = innerSelecteds.value
  emit('confirm', selectTags)
}

function isSelected(tag: ITag) {
  // console.log(innerSelecteds.value, 'innerSelecteds.value')
  return innerSelecteds.value.includes(tag.tagId) || false
}

function handleChange(selecteds: string[]) {

}

function handleAllSelectClick() {
  tagPickerRef.value.selectAll(isAllSelected.value)
  isAllSelected.value = !isAllSelected.value
}
</script>

<template>
  <bottom-popup v-model="visible" title="标签选择" @confirm="handleConfirm" @after-enter="handleAfterEnter">
    <template #action>
      <view
        v-if="props.showSelectAll"
        class="px-3 py-1 text-base text-gray-400"
        hover-class="bg-gray-50"
        :hover-start-time="0"
        :hover-stay-time="200"
        @tap="handleAllSelectClick"
      >
        <text>{{ isAllSelected ? '取消全选' : '全选' }}</text>
      </view>
    </template>

    <!-- 标签列表 -->
    <view class="px-2">
      <list-picker-view
        ref="tagPickerRef"
        v-model="innerSelecteds"
        :list="tags"
        :shoe-icon="false"
        value-key="tagId"
        custom-class="h-[50vh]"
        @change="handleChange"
      />
    </view>
  </bottom-popup>
</template>

<style lang="scss" scoped>

</style>
