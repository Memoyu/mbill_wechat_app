<script setup lang="ts">
import type { DateTimeType } from '@wot-ui/ui/components/wd-datetime-picker-view/types'

const props = withDefaults(defineProps<{
  date: number
  type?: DateTimeType
}>(), {
  type: 'datetime',
})
const emit = defineEmits(['change', 'update:date'])
const show = defineModel<boolean>()
const innerDate = ref(Date.now())

watch(() => props.date, (val) => {
  if (val) {
    innerDate.value = val
  }
})

function handleDateChange(val) {

}

function handleConfirmClick() {
  emit('change', { value: innerDate.value })
  emit('update:date', innerDate.value)
  show.value = false
}
</script>

<template>
  <mbill-popup v-model="show">
    <wd-datetime-picker-view v-model="innerDate" :type="type" @change="handleDateChange" />
  </mbill-popup>
</template>

<style lang="scss" scoped>

</style>
