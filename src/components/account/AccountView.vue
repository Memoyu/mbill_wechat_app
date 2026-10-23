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
  height?: string
  showTop?: boolean
}>(), {
  height: '40vh',
})
const emit = defineEmits(['change'])
const selected = defineModel<string>()

const accountStore = useAccountStore()

const option = computed(() => ({
  list: accountStore.list,
  tops: props.showTop ? accountStore.tops : [],
}))

function handleAccountItemTap(item: any) {
  // console.log('账户选中', item)
  const { select, parent } = item

  let name = select.name
  if (parent) {
    name = `${parent.name}-${name}`
  }

  emit('change', { ...select, name })
}

function handleManage() {
  uni.navigateTo({ url: '/pages/account/index' })
}
</script>

<template>
  <grid-picker-view
    v-model="selected"
    :option="option"
    :scroll-height="height"
    id-key="accountId"
    @change="handleAccountItemTap"
    @manage="handleManage"
  />
</template>

<style lang="scss" scoped>

</style>
