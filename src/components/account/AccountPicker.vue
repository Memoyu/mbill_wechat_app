<script setup lang="ts">
import type { IBillAccount } from '@/api/types/bill'

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

const account = ref<IBillAccount>()
const accountId = ref()

/**
 * 显示弹窗时触发，显示账户
 */
function handleAfterEnter() {
  accountId.value = props.account
}

function handleConfirm() {
  emit('confirm', account.value)
  show.value = false
}
</script>

<template>
  <bottom-popup v-model="show" title="选择账户" @after-enter="handleAfterEnter" @confirm="handleConfirm">
    <account-view v-if="show" v-model="accountId" @change="(ac: IBillAccount) => account = ac" />
  </bottom-popup>
</template>

<style lang="scss" scoped>

</style>
