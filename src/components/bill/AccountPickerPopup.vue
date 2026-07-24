<script setup lang="ts">
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

const accountItem = ref()
const accountId = ref()

/**
 * 显示弹窗时触发，显示账户
 */
function handleAfterEnter() {
  accountId.value = props.account
}

function handleConfirm(check: (pass: boolean) => void) {
  emit('confirm', { account: accountItem.value.select, parent: accountItem.value.parent })
  check(true)
}
</script>

<template>
  <bottom-popup v-model="show" title="选择账户" @after-enter="handleAfterEnter" @confirm="handleConfirm">
    <account-view v-model="accountId" @change="(item: any) => accountItem = item" />
  </bottom-popup>
</template>

<style lang="scss" scoped>

</style>
