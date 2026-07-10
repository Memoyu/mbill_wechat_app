<script setup lang="ts">
import type { IAccount } from '@/api/types/account'
import { useAccountStore } from '@/store'

defineOptions({
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared',
  },
})

const props = defineProps<{
  account: string
}>()
const emit = defineEmits(['change'])
const show = defineModel<boolean>()

const accountStore = useAccountStore()

const accountData = ref()
const AccountPickerRef = ref()
const currentId = ref()
const currentAccount = ref()
const currentParent = ref()

watch(() => props.account, (val) => {
  currentId.value = val
})

onMounted(() => {
  initSelectItem()
})

function initSelectItem() {
  const accounts = accountStore.accounts.map((a) => {
    return {
      id: a.accountId,
      name: a.name,
      icon: a.icon,
      childs: (a.childs ?? []).map((c) => {
        return {
          id: c.accountId,
          name: c.name,
          icon: c.icon,
        }
      }),
    }
  })
  accountData.value = {
    list: accounts,
    tops: [],
  }
}

function handleAfterEnter() {
  // console.log('handleAfterEnter')
  AccountPickerRef.value.initSelected(currentId.value)
}

function handleAccountItemTap(item: any) {
  console.log('账户选中', item)
  const { id, account, parent } = item
  currentId.value = id
  currentAccount.value = account
  currentParent.value = parent
}

function handleConfirm(check: (pass: boolean) => void) {
  emit('change', { id: currentId.value, account: currentAccount.value, parent: currentParent.value })
  check(true)
}
</script>

<template>
  <bottom-popup v-model="show" title="选择账户" @after-enter="handleAfterEnter" @confirm="handleConfirm">
    <view class="account-items">
      <grid-picker-view ref="AccountPickerRef" v-model="currentId" :data="accountData" :height="400" @change="handleAccountItemTap" />
    </view>
  </bottom-popup>
</template>

<style lang="scss" scoped>

</style>
