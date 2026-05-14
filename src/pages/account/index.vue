<script setup lang="ts">
import type { ActionItem } from '@/typings'
import { useAccountStore } from '@/store'
import { systemInfo } from '@/utils/systemInfo'

definePage({
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '账户管理',
  },
})

const accountStore = useAccountStore()
const actions: ActionItem[] = [
  {
    title: '创建',
    icon: 'plus',
    action: handleCreateTap,
  },
]
const show = ref(false)
const scrollHeight = ref(300)
const accounts = ref(accountStore.accounts)

onMounted(() => {
  nextTick(() => {
    uni.createSelectorQuery().select('#TOP_NAVBAR').boundingClientRect((data: UniApp.NodeInfo) => {
      scrollHeight.value = systemInfo.windowHeight - (data.height + 16) // 16为外层view的padding
    }).exec()
  })
})

function handleCreateTap() {
  console.log('handleCreateTap')
}

function handleSortChange(list: any[]) {
  // console.log('handleSortChange', list)
  // accounts.value = list
}

function handleChildSortChange(list: any[], parent) {
  console.log('handleChildSortChange', list, parent)
}

function handleEditItemTap(item) {
  console.log('handleEditItemTap', item)
}
</script>

<template>
  <page-meta :page-style="`overflow:${show ? 'hidden' : 'visible'};`" />
  <draw-background2 />
  <nav-bar id="TOP_NAVBAR" :actions="actions" title="账户管理" />
  <view class="w-screen">
    <view class="p-2">
      <drag-sort-list-view expand :gap="8" :list="accounts" key-prop="accountId" :height="scrollHeight" @change="handleSortChange">
        <template #title="{ listItem }">
          <view class="account-title-box">
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
            <drag-sort-grid-view :gap="8" :column="4" :list="listItem.childs" key-prop="accountId" @change="list => handleChildSortChange(list, listItem)">
              <template #content="{ gridItem }">
                <view class="flex flex-col items-center p-2">
                  <wd-img :width="30" round :height="30" :src="gridItem.icon" />
                  <view class="account-item-title">
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
.account-title-box {
  border-radius: 19px;
  box-sizing: border-box;
  padding: 0.7rem;
  // border-bottom: 1px solid #f0f0f0;
}

.account-item-title {
  font-size: 12px;
}
</style>
