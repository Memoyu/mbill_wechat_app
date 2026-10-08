<script lang="ts" setup>
import { useToast } from '@wot-ui/ui'
import { storeToRefs } from 'pinia'
import { useGlobalLoading } from '@/hooks/useGlobalLoading'
import { getCurrentPath } from '@/utils'

defineOptions({
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared',
  },
})
const { loadingOptions, currentPage } = storeToRefs(useGlobalLoading())

const { close: closeGlobalLoading } = useGlobalLoading()

const loading = useToast('globalLoading')
const currentPath = getCurrentPath()

// #ifdef MP-ALIPAY
const hackAlipayVisible = ref(false)

nextTick(() => {
  hackAlipayVisible.value = true
})
// #endif

watch(() => loadingOptions.value, (newVal) => {
  if (newVal && newVal.show) {
    if (currentPage.value === currentPath) {
      loading.loading(loadingOptions.value)
    }
  }
  else {
    loading.close()
  }
})
</script>

<template>
  <!-- #ifdef MP-ALIPAY -->
  <wd-toast v-if="hackAlipayVisible" selector="globalLoading" :closed="closeGlobalLoading" />
  <!-- #endif -->
  <!-- #ifndef MP-ALIPAY -->
  <wd-toast selector="globalLoading" :closed="closeGlobalLoading" />
  <!-- #endif -->
</template>
