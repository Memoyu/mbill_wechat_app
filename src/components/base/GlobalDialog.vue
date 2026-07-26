<script lang="ts" setup>
import { useDialog } from '@wot-ui/ui'
import { deepClone, isFunction } from '@wot-ui/ui/common/util'
import { storeToRefs } from 'pinia'
import { getCurrentPath } from '@/utils'

const { dialogOptions, currentPage } = storeToRefs(useGlobalDialog())

const dialog = useDialog('globalDialog')
const currentPath = getCurrentPath()

watch(() => dialogOptions.value, (newVal) => {
  if (newVal) {
    if (currentPage.value === currentPath) {
      const option = deepClone(newVal)
      dialog.show(option).then((res) => {
        if (isFunction(option.success)) {
          option.success(res)
        }
      }).catch((err) => {
        if (isFunction(option.fail)) {
          option.fail(err)
        }
      })
    }
  }
  else {
    dialog.close()
  }
})
</script>

<script lang="ts">
export default {
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
}
</script>

<template>
  <wd-dialog selector="globalDialog" />
</template>
