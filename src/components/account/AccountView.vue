<script setup lang="ts">
import type { GridSelectItem } from '../base/GridPickerView/GridPickerView.vue'
import { getAccountTop } from '@/api/account'
import { useAccountStore } from '@/store'

defineOptions({
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<{
  height?: number
  showTop?: boolean
}>(), {
  height: 400,
})
const emit = defineEmits(['change'])
const selected = defineModel<string>()

const accountStore = useAccountStore()

const tops = ref<GridSelectItem[]>([])
const list = ref<GridSelectItem[]>([])

onMounted(() => {
  initSelectItem()
})

function initSelectItem() {
  if (props.showTop) {
    getAccountTop().then((res) => {
      tops.value = (res ?? []).map((a) => {
        return {
          id: a.accountId,
          name: a.name,
          icon: a.icon,
        } as GridSelectItem
      })
    })
  }

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
  list.value = accounts
}

function handleAccountItemTap(item: any) {
  // console.log('账户选中', item)
  const { select, parent } = item

  let name = select.name
  if (parent) {
    name = `${parent.name}-${name}`
  }

  emit('change', {
    accountId: select.id,
    name,
    icon: select.icon,
  })
}
</script>

<template>
  <grid-picker-view v-model="selected" :list="list" :tops="tops" :scroll-height="height" @change="handleAccountItemTap" />
</template>

<style lang="scss" scoped>

</style>
