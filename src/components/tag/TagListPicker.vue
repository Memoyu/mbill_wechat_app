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
const selecteds = defineModel<ITag[]>()
const visible = defineModel<boolean>('visible')
const collapseRef = ref()
const tagStore = useTagStore()
const tags = computed(() => tagStore.tags)

const isAllSelected = ref()
const innerSelecteds = ref<ITag[]>([])
const expandeds = ref<string[]>([])

watch(() => selecteds.value, (newValue) => {
  if (newValue)
    innerSelecteds.value = lodash.cloneDeep(newValue)
}, { immediate: true, deep: true })

watch(() => visible.value, (newValue) => {
  // 重置选中项
  if (newValue) {
    collapseRef.value?.toggleAll(true)
    innerSelecteds.value = lodash.cloneDeep(selecteds.value ?? [])
  }
}, { immediate: true })

function handleAfterEnter() {
  // console.log('handleAfterEnter')
}

function handleConfirm() {
  selecteds.value = innerSelecteds.value
  const filter: ITag[] = []
  tags.value.forEach((t) => {
    if (isSelected(t)) {
      filter.push(t)
    }
    t.childs?.forEach((ct) => {
      if (isSelected(ct)) {
        filter.push(ct)
      }
    })
  })
  emit('confirm', filter)
}

function isSelected(tag: ITag) {
  return innerSelecteds.value.some(t => t.tagId === tag.tagId) || false
}

function hasChilds(tag: ITag) {
  return tag.childs && tag.childs.length > 0
}

function handleAllSelectClick() {
  if (isAllSelected.value) {
    innerSelecteds.value = []
  }
  else {
    tags.value.forEach((t) => {
      innerSelecteds.value.push(t)
      innerSelecteds.value.push(...(t.childs?.map(t => t) ?? []))
    })
  }
  isAllSelected.value = !isAllSelected.value
}

function handleTagClick(tag: ITag) {
  // console.log(tag, 'tag')
  if (isSelected(tag)) {
    innerSelecteds.value = innerSelecteds.value.filter(t => t.tagId !== tag.tagId)
  }
  else {
    innerSelecteds.value.push(tag)
  }
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
    <!-- 目录列表 -->
    <view class="px-2">
      <scroll-view scroll-y class="h-[50vh]">
        <view class="p-2 space-y-3">
          <wd-collapse ref="collapseRef" v-model="expandeds">
            <wd-collapse-item v-for="tag in tags" :key="tag.tagId" :name="tag.tagId" :border="false">
              <template #title="{ expanded }">
                <view
                  class="relative flex items-center gap-3 py-3"
                >
                  <view class="flex flex-1 items-center justify-between gap-3 px-2">
                    <view class="relative flex items-center rounded-md bg-indigo-500/10 px-2 py-1" @tap.stop="handleTagClick(tag)">
                      <!-- <wd-checkbox :model-value="isSelected(tag)" @tap.stop="handleTagClick(tag)" /> -->
                      <view class="truntte ml-1 flex-1 text-sm">
                        {{ tag.name }}
                      </view>

                      <view
                        class="absolute inset-0 z-10 overflow-hidden rounded-md transition-all duration-200"
                        :class="[isSelected(tag) ? 'bg-indigo-500/20 ring-2 ring-indigo-500' : 'bg-transparent']"
                      >
                        <view
                          v-if=" isSelected(tag)"
                          class="absolute h-5 w-5 flex animate-fade-in animate-duration-200 items-end justify-end rounded-full bg-indigo-500 shadow-sm -left-2 -top-2"
                        />
                      </view>
                    </view>
                    <view v-if="hasChilds(tag)">
                      <wd-icon v-if="expanded" size="16" name="up" />
                      <wd-icon v-else size="16" name="down" />
                    </view>
                  </view>
                </view>
              </template>

              <view
                v-if="hasChilds(tag)"
                class="flex flex-wrap gap-3 rounded-md bg-[var(--wot-input-bg)] p-2"
              >
                <view
                  v-for="child in tag.childs" :key="child.tagId"
                  class="relative rounded-md bg-indigo-500/10 px-2 py-1"
                  @tap="handleTagClick(child)"
                >
                  <view class="max-w-[80px] flex items-center">
                    <view class="truntte ml-1 flex-1 text-sm">
                      {{ child.name }}
                    </view>
                  </view>

                  <view
                    class="absolute inset-0 z-10 overflow-hidden rounded-md transition-all duration-200"
                    :class="[isSelected(child) ? 'bg-indigo-500/20 ring-2 ring-indigo-500' : 'bg-transparent']"
                  >
                    <view
                      v-if=" isSelected(child)"
                      class="absolute h-5 w-5 flex animate-fade-in animate-duration-200 items-end justify-end rounded-full bg-indigo-500 shadow-sm -left-2 -top-2"
                    />
                  </view>
                </view>
              </view>
            </wd-collapse-item>
          </wd-collapse>
        </view>
      </scroll-view>
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
