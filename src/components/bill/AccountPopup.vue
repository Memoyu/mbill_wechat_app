<script setup lang="ts">
import type { GridSelectItem } from '../base/GridSelectView.vue'
import { useAccountStore } from '@/store'

const props = withDefaults(defineProps<{
  id: number
}>(), {
})
const show = defineModel<boolean>()

const accountStore = useAccountStore()

const accounts = ref<GridSelectItem>(accountStore.accounts.map((a) => {
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
}))
const active = ref()

function handleAccountItemTap(item: any) {
  console.log('账户选中', item)
}
</script>

<template>
  <mbill-popup v-model="show">
    <view class="account-items">
      <!--  -->
      <grid-select-view :list="accounts" :height="400" @change="handleAccountItemTap" />
    </view>
  </mbill-popup>
</template>

<style lang="scss" scoped>
.account-popup-toolbar {
  position: relative;
  display: flex;
  font-size: 16px;
  height: 54px;
  line-height: 16px;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
}

.account-popup-action {
  display: block;
  border: none;
  outline: none;
  font-size: 16px;
  color: #4d80f0;
  background: transparent;
  padding: 24px 15px 14px;
}

.account-popup-action-cancel {
  color: #666666;
}
</style>
