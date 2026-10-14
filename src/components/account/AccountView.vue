<script setup lang="ts">
import type { GridPickerOption, GridPickerOptionItem } from '../base/GridPickerView/GridPickerView.vue'
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
  height?: string
  showTop?: boolean
}>(), {
  height: '40vh',
})
const emit = defineEmits(['change'])
const selected = defineModel<string>()

const accountStore = useAccountStore()

const option = ref<GridPickerOption>({ list: [] })

onMounted(() => {
  initAccount()
})

function initAccount() {
  const op: GridPickerOption = { list: [] }
  // 账户列表
  op.list = accountStore.accounts.map((a) => {
    return {
      id: a.accountId,
      name: a.name,
      icon: a.icon,
      childs: (a.childs ?? []).map((c) => {
        return {
          id: c.accountId,
          name: c.name,
          icon: c.icon,
        } as GridPickerOptionItem
      }),
    }
  })
  // 常用账户
  if (props.showTop) {
    getAccountTop().then((res) => {
      op.tops = (res ?? []).map((a) => {
        return {
          id: a.accountId,
          name: a.name,
          icon: a.icon,
        } as GridPickerOptionItem
      })
      option.value = { ...op }
    })
  }

  option.value = op
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
  <grid-picker-view v-model="selected" :option="option" :scroll-height="height" @change="handleAccountItemTap" />
</template>

<style lang="scss" scoped>

</style>
