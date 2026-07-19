<script setup lang="ts">
import type { GridSelectData, GridSelectItem } from './GridPickerView/GridPickerView.vue'
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
const emit = defineEmits(['confirm'])
const show = defineModel<boolean>()

const accountStore = useAccountStore()

const accountData = ref<GridSelectData>({ list: [], tops: [] })
const AccountPickerRef = ref()
const account = ref()
const parent = ref()

const accountId = computed(() => props.account)

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
        } as GridSelectItem
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
  AccountPickerRef.value.initSelected(accountId.value)
}

function handleAccountItemTap(item: any) {
  console.log('账户选中', item)
  account.value = item.select
  parent.value = item.parent
}

function handleConfirm(check: (pass: boolean) => void) {
  emit('confirm', { account: account.value, parent: parent.value })
  check(true)
}
</script>

<template>
  <bottom-popup v-model="show" title="选择账户" @after-enter="handleAfterEnter" @confirm="handleConfirm">
    <view class="account-items">
      <grid-picker-view ref="AccountPickerRef" v-model="accountId" :data="accountData" :height="400" @change="handleAccountItemTap" />
    </view>
  </bottom-popup>
</template>

<style lang="scss" scoped>

</style>
