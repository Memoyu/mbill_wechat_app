<script setup lang="ts">
import type { DateTimeType } from '@wot-ui/ui/components/wd-datetime-picker-view/types'
import dayjs from 'dayjs'

export interface IDatePickerValue {
  value: number
  type: DateTimeType
}

const props = withDefaults(defineProps<{
  date: IDatePickerValue
  chooseType?: boolean
}>(), {
})
const emit = defineEmits(['change', 'update:date'])
const show = defineModel<boolean>()

const types = [
  {
    label: '按天',
    value: 'date',
    icon: 'icon-date',
  },
  {
    label: '按月',
    value: 'year-month',
    icon: 'icon-month',
  },
  {
    label: '按年',
    value: 'year',
    icon: 'icon-year',
  },
]

const innerType = ref<DateTimeType>()
const innerDate = ref(dayjs().valueOf())

watch(() => show.value, (val) => {
  if (val) {
    innerType.value = props.date.type
    innerDate.value = props.date.value
  }
})

watch(() => props.date, (val) => {
  if (val) {
    innerType.value = val.type
    innerDate.value = val.value
  }
}, { immediate: true, deep: true })

function handleDateChange() {
}

function handleConfirm() {
  const date = { value: innerDate.value, type: innerType.value }
  emit('change', date)
  emit('update:date', date)
  show.value = false
}
</script>

<template>
  <bottom-popup v-model="show" auto-height @confirm="handleConfirm">
    <view v-if="chooseType" class="flex items-center justify-between px-7 pb-2">
      <view
        v-for="item in types"
        :key="item.value"
        class="rounded-lg bg-gray-100/70 px-5 py-1"
        :class="[innerType === item.value ? 'bg-indigo-300/20' : '']"
        @tap="innerType = item.value as DateTimeType"
      >
        <view class="flex flex-col items-center justify-between">
          <view class="iconfont text-3xl" :class="[item.icon]" />
          <view>
            {{ item.label }}
          </view>
        </view>
      </view>
    </view>
    <wd-datetime-picker-view v-model="innerDate" :type="innerType" @change="handleDateChange" />
  </bottom-popup>
</template>

<style lang="scss" scoped>

</style>
