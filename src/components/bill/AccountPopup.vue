<script setup lang="ts">
import { useAccountStore } from '@/store'

const props = withDefaults(defineProps<{
  account?: string
}>(), {
})
const show = defineModel<boolean>()

const accountStore = useAccountStore()

const accounts = ref()

watch(() => show.value, (val) => {
  if (val) {
    initSelectItem()
  }
})

function initSelectItem() {
  accounts.value = accountStore.accounts.map((a) => {
    return {
      id: a.accountId,
      name: a.name,
      icon: a.icon,
      childs: a.childs.map((c) => {
        return {
          id: c.accountId,
          name: c.name,
          icon: c.icon,
        }
      }),
    }
  })
}

function handleAccountItemTap(item: any) {
  console.log('账户选中', item)
}
</script>

<template>
  <mbill-popup v-model="show">
    <view class="account-items">
      <grid-select-view :list="accounts" :height="400" @change="handleAccountItemTap" />
    </view>
  </mbill-popup>
</template>

<style lang="scss" scoped>

</style>
