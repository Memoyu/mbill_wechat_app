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
  showSelectAll?: boolean
}>()
const emit = defineEmits(['confirm'])
const selecteds = defineModel<string[]>({ default: [] })
const visible = defineModel<boolean>('visible')

const accountStore = useAccountStore()
const accounts = computed(() => accountStore.accounts)

const accountPickerRef = ref()
const isAllSelected = ref()
const innerSelecteds = ref<string[]>([])

watch(() => selecteds.value, (newValue) => {
  if (newValue)
    innerSelecteds.value = lodash.cloneDeep(newValue ?? [])
}, { immediate: true, deep: true })

watch(() => visible.value, (newValue) => {
  // 重置选中项
  if (newValue) {
    accountPickerRef.value.toggleAll(true)
    innerSelecteds.value = lodash.cloneDeep(selecteds.value ?? [])
  }
})

function handleAfterEnter() {
  // console.log('handleAfterEnter')
}

function handleConfirm() {
  const selectAccounts: IAccount[] = []
  accounts.value.forEach((a) => {
    if (isSelected(a)) {
      selectAccounts.push({ ...a })
    }
    a.childs?.forEach((ac) => {
      if (isSelected(ac)) {
        selectAccounts.push({ ...ac, name: `${a.name}-${ac.name}` })
      }
    })
  })
  selecteds.value = innerSelecteds.value
  emit('confirm', selectAccounts)
}

function isSelected(account: IAccount) {
  return innerSelecteds.value.includes(account.accountId) || false
}

function handleChange(selecteds: string[]) {

}

function handleAllSelectClick() {
  accountPickerRef.value.selectAll(isAllSelected.value)
  isAllSelected.value = !isAllSelected.value
}
</script>

<template>
  <bottom-popup v-model="visible" title="账户选择" @confirm="handleConfirm" @after-enter="handleAfterEnter">
    <template #action>
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
    </template>
    <!-- 账户列表 -->
    <view class="px-2">
      <list-picker-view
        ref="accountPickerRef"
        v-model="innerSelecteds"
        :list="accounts"
        value-key="accountId"
        custom-class="h-[50vh]"
        @change="handleChange"
      />
    </view>
  </bottom-popup>
</template>

<style lang="scss" scoped>

</style>
