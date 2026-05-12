<script setup lang="ts">
const props = withDefaults(defineProps<{
  date: number
}>(), {

})
const emit = defineEmits(['change', 'update:date'])
const show = defineModel<boolean>()
const innerDate = ref(Date.now())
const calendarViewRef = ref()

watch(() => show.value, (val) => {
  if (val) {
    nextTick(() => {
      calendarViewRef.value && calendarViewRef.value.scrollIntoView()
    })
  }
})

watch(() => props.date, (val) => {
  if (val) {
    innerDate.value = val
  }
})

function handleDateChange() {
  emit('change', { value: innerDate.value })
  emit('update:date', innerDate.value)
  show.value = false
}
</script>

<template>
  <mbill-popup v-model="show">
    <wd-calendar-view ref="calendarViewRef" v-model="innerDate" type="datetime" hide-second @change="handleDateChange" />
  </mbill-popup>
</template>

<style lang="scss" scoped>

</style>
