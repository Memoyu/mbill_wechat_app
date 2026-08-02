<script setup lang="ts">
import type { IAccount } from '@/api/types/account'
import lodash from 'lodash'
import { useAccountStore } from '@/store'

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
const selecteds = defineModel<string[]>()
const visible = defineModel<boolean>('visible')
const collapseRef = ref()
const accountStore = useAccountStore()
const accounts = computed(() => accountStore.accounts)

const isAllSelected = ref()
const innerSelecteds = ref<string[]>([])
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
  emit('confirm', accounts.value.filter(ac => isSelected(ac)))
}

function isSelected(account: IAccount) {
  return innerSelecteds.value.includes(account.accountId) || false
}

function hasChilds(account: IAccount) {
  return account.childs && account.childs.length > 0
}

function handleAllSelectClick() {
  if (isAllSelected.value) {
    innerSelecteds.value = []
  }
  else {
    accounts.value.forEach((c) => {
      innerSelecteds.value.push(c.accountId)
      innerSelecteds.value.push(...(c.childs?.map(c => c.accountId) ?? []))
    })
  }
  isAllSelected.value = !isAllSelected.value
}

function handleAccountClick(account: IAccount) {
  // console.log(account, 'account')
  if (isSelected(account)) {
    innerSelecteds.value = innerSelecteds.value.filter(id => id !== account.accountId)
  }
  else {
    innerSelecteds.value.push(account.accountId)
  }
}
</script>

<template>
  <bottom-popup v-model="visible" title="账户选择" @confirm="handleConfirm" @after-enter="handleAfterEnter">
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
    <!-- 目录列表 -->
    <view class="px-2">
      <scroll-view scroll-y class="h-[50vh]">
        <view class="p-2 space-y-3">
          <wd-collapse ref="collapseRef" v-model="expandeds">
            <wd-collapse-item v-for="account in accounts" :key="account.accountId" :name="account.accountId" :border="false">
              <template #title="{ expanded }">
                <view
                  class="relative flex items-center gap-3 py-3"
                >
                  <view class="flex flex-1 items-center justify-between gap-3">
                    <view class="flex items-center">
                      <wd-checkbox :model-value="isSelected(account)" @tap.stop="handleAccountClick(account)" />
                      <view class="ml-3">
                        <bill-icon size="23" :icon="account.icon" :text="account.name" />
                      </view>
                      <view class="trunacte ml-1 flex-1 text-sm">
                        {{ account.name }}
                      </view>
                    </view>
                    <view v-if="hasChilds(account)">
                      <wd-icon v-if="expanded" size="16" name="up" />
                      <wd-icon v-else size="16" name="down" />
                    </view>
                  </view>
                </view>
              </template>

              <view
                v-if="hasChilds(account)"
                class="flex flex-wrap gap-3 rounded-2xl bg-[var(--wot-input-bg)] p-2"
              >
                <view
                  v-for="child in account.childs" :key="child.accountId"
                  class="relative rounded-2xl px-2 py-1"
                  @tap="handleAccountClick(child)"
                >
                  <view class="max-w-[100px] flex items-center">
                    <view>
                      <bill-icon size="23" :icon="child.icon" :text="child.name" />
                    </view>
                    <view class="trunacte ml-1 flex-1 text-sm">
                      {{ child.name }}
                    </view>
                  </view>

                  <view
                    class="absolute inset-0 z-10 overflow-hidden rounded-md transition-all duration-200"
                    :class="[isSelected(child) ? 'bg-indigo-500/10 ring-2 ring-indigo-500' : 'bg-transparent']"
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
