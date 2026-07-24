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

const props = withDefaults(defineProps<{
  showTop?: boolean
  height?: number
}>(), {
  showTop: true,
  height: 400,
})
const emit = defineEmits(['change'])
const selected = defineModel<string>()

const accountStore = useAccountStore()

const accountData = ref<GridSelectData>({ list: [], tops: [] })

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

function handleAccountItemTap(item: any) {
  console.log('账户选中', item)
  const { select, parent } = item
  emit('change', { select, parent })
}
</script>

<template>
  <grid-picker-view v-model="selected" :data="accountData" :height="height" @change="handleAccountItemTap" />
</template>

<style lang="scss" scoped>

</style>
