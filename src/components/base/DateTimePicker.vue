<script setup lang="ts">
import dayjs from 'dayjs'

const props = withDefaults(defineProps<{
  date: number
}>(), {

})
const emit = defineEmits(['confirm', 'update:date'])
const show = defineModel<boolean>()
const innerDate = ref(Date.now())
const defaultTime = ref()
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
    defaultTime.value = dayjs(val).format('HH:mm:00')
    // console.log(val, defaultTime.value)
  }
}, { immediate: true })

function handleDateChange() {

}

function handleConfirm() {
  // console.log('handleConfirm', innerDate.value)
  emit('update:date', innerDate.value)
  emit('confirm', innerDate.value)
  show.value = false
}
</script>

<template>
  <bottom-popup v-model="show" auto-height @confirm="handleConfirm">
    <wd-calendar-view
      ref="calendarViewRef"
      v-model="innerDate"
      switch-mode="year-month"
      :default-time="defaultTime"
      type="datetime"
      hide-second
      :min-date="dayjs().subtract(5, 'year').valueOf()"
      @change="handleDateChange"
    />
  </bottom-popup>
</template>

<style lang="scss" scoped>

</style>
