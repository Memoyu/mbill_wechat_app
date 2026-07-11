<script setup lang="ts">
import type { ITag } from '@/api/types/tag'
import { useTagStore } from '@/store'

const props = withDefaults(defineProps<{
  tags: string[]
}>(), {
})
const emit = defineEmits(['confirm'])
const show = defineModel<boolean>()
const tagStore = useTagStore()

const tagGroups = computed(() => {
  return tagStore.tags
})

const selectedIds = ref(props.tags)

function isSelected(item: ITag) {
  return selectedIds.value.includes(item.tagId)
}

function handleTagItemTap(item: ITag) {
  selectedIds.value = isSelected(item) ? selectedIds.value.filter(sid => sid !== item.tagId) : [...selectedIds.value, item.tagId]
  // console.log('标签选中', selectedIds.value, item)
}

function handleConfirm(check: (pass: boolean) => void) {
  const ts: ITag[] = []
  tagGroups.value.forEach((tagGroup) => {
    (tagGroup.childs || []).forEach((tag) => {
      if (isSelected(tag)) {
        ts.push(tag)
      }
    })
  })

  emit('confirm', ts)
  check(true)
}
</script>

<template>
  <bottom-popup v-model="show" title="选择标签" @confirm="handleConfirm">
    <view class="p-2">
      <view v-for="tagGroup in tagGroups" :key="tagGroup.tagId" class="mb-4">
        <view class="pb-2 font-semibold">
          {{ tagGroup.name }}
        </view>
        <view class="flex flex-wrap gap-2">
          <view
            v-for="tag in tagGroup.childs" :key="tag.tagId"
            class="tag-picker-item-box"
            :class="[isSelected(tag) ? 'ring-2 ring-indigo-500 ring-offset-1' : '']"
            @tap="handleTagItemTap(tag)"
          >
            <view class="tag-picker-item-title">
              {{ tag.name }}
            </view>
          </view>
        </view>
      </view>
    </view>
  </bottom-popup>
</template>

<style lang="scss" scoped>
.tag-picker-item-box {
  @apply: font-bold rounded-lg py-2 px-3 bg-indigo-300/20;
}
.tag-picker-item-title {
  font-size: 12px;
  @apply: text-center;
}
</style>
