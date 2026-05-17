<script setup lang="ts">
import type { ITag } from '@/api/types/tag'
import type { ActionItem } from '@/typings'
import { useTagStore } from '@/store'
import { systemInfo } from '@/utils/systemInfo'

definePage({
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '标签管理',
  },
})

const tagStore = useTagStore()
const actions: ActionItem[] = [
  {
    title: '创建',
    icon: 'plus',
    action: handleCreateTap,
  },
]
const show = ref(false)
const scrollHeight = ref(300)
const tags = ref(tagStore.tags)

onMounted(() => {
  nextTick(() => {
    uni.createSelectorQuery().select('#TOP_NAVBAR').boundingClientRect((data: any) => {
      scrollHeight.value = systemInfo.windowHeight - (data.height + 16) // 16为外层view的padding
    }).exec()
  })
})

function handleCreateTap() {
  console.log('handleCreateTap')
}

function handleSortChange(list: ITag[]) {
  // console.log('handleSortChange', list)
  // tags.value = list
}

function handleChildSortChange(list: ITag[], parent: any) {
  console.log('handleChildSortChange', list, parent as ITag)
}

function handleEditItemTap(item: any) {
  console.log('handleEditItemTap', item as ITag)
}
</script>

<template>
  <page-meta :page-style="`overflow:${show ? 'hidden' : 'visible'};`" />
  <draw-background2 />
  <nav-bar id="TOP_NAVBAR" :actions="actions" title="标签管理" />
  <view class="w-screen">
    <view class="p-2">
      <drag-sort-list-view expand :gap="8" :list="tags" key-prop="tagId" :height="scrollHeight" @change="handleSortChange">
        <template #title="{ listItem }">
          <view class="tag-title-box">
            <view class="flex items-center justify-between">
              <view class="mr-3">
                <wd-icon v-if="listItem.expand" name="caret-down" />
                <wd-icon v-else name="caret-right" />
              </view>
              <view class="flex-1 font-bold">
                {{ listItem.name }}
              </view>

              <view class="px-2" @tap.stop="handleEditItemTap(listItem)">
                <wd-icon name="menu" />
              </view>
            </view>
          </view>
        </template>
        <template #content="{ listItem }">
          <view v-if="listItem.childs && listItem.childs.length > 0" class="p-2">
            <drag-sort-grid-view :gap="8" :column="4" :list="listItem.childs" key-prop="tagId" @change="list => handleChildSortChange(list, listItem)">
              <template #content="{ gridItem }">
                <view class="flex items-center justify-center bg-indigo-500/10 px-1.5 py-2" @tap.stop="() => {}">
                  <view class="tag-item-title line-clamp-1 text-nowrap">
                    {{ gridItem.name }}
                  </view>
                </view>
              </template>
            </drag-sort-grid-view>
          </view>
        </template>
      </drag-sort-list-view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.tag-title-box {
  border-radius: 19px;
  box-sizing: border-box;
  padding: 0.7rem;
  // border-bottom: 1px solid #f0f0f0;
}

.tag-item-title {
  font-size: 12px;
}
</style>
