<script setup lang="ts">
import { useAccountStore } from '@/store'

defineOptions({
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<{
  account?: string
}>(), {
})
const show = defineModel<boolean>()
const account = defineModel<string>('account')

const accountStore = useAccountStore()

const accountData = ref()
const AccountPickerRef = ref()

// watch(() => show.value, (val) => {
//   if (val) {
//     initSelectItem()
//   }
// })
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
  console.log('handleAfterEnter')
  AccountPickerRef.value.initSelected(account.value)
}

function handleAccountItemTap(item: any) {
  console.log('账户选中', item)
}
</script>

<template>
  <bottom-popup v-model="show" title="选择账户" @after-enter="handleAfterEnter">
    <view class="account-items">
      <grid-picker-view ref="AccountPickerRef" :data="accountData" :height="400" @change="handleAccountItemTap" />
    </view>
  </bottom-popup>
</template>

<style lang="scss" scoped>

</style>
