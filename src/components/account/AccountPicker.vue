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
const init = ref(false)

watch(() => show.value, (val) => {
  if (val) {
    init.value = true
  }
})

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
    <account-view v-if="init" v-model="accountId" show-top @change="(ac: IBillAccount) => account = ac" />
  </bottom-popup>
</template>

<style lang="scss" scoped>

</style>
