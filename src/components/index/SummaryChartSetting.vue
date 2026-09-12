<script setup lang="ts">
import { useIndexBillStore, useSettingsStore } from '@/store'

defineOptions({
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared',
  },
})

const props = defineProps<{
}>()
const show = defineModel({ default: false })

const types = [
  {
    label: '支出',
    value: 0,
  },
  {
    label: '收入',
    value: 1,
  },
]
const dateTypes = [
  {
    label: '本周',
    value: 0,
  },
  {
    label: '近7天',
    value: 1,
  },
  {
    label: '近15天',
    value: 2,
  },
]

const indexBillStore = useIndexBillStore()
const settingsStore = useSettingsStore()

const innerType = ref()
const innerDate = ref(0)

watch(() => show.value, (val) => {
  // 弹窗时，根据选项设置恢复内部选项
  if (val) {
    innerType.value = settingsStore.index.charts.type
    innerDate.value = settingsStore.index.charts.date
  }
})

/**
 * 确认设置
 */
function handleConfirm() {
  settingsStore.updateIndexCharts(innerDate.value, innerType.value)
  indexBillStore.loadCharts()
  show.value = false
}
</script>

<template>
  <!-- 汇总设置 -->
  <bottom-popup v-model="show" height="30vh" title="汇总设置" @confirm="handleConfirm">
    <view class="mb-3 flex flex-col p-3 space-y-2">
      <!-- 账单类型 -->
      <view>
        <view class="filter-content-title">
          账单类型
        </view>
        <wd-radio-group v-model="innerType" allow-uncheck type="button">
          <wd-radio v-for=" t in types" :key="t.value" :value="t.value">
            {{ t.label }}
          </wd-radio>
        </wd-radio-group>
      </view>

      <!-- 时间范围 -->
      <view>
        <view class="filter-content-title">
          时间范围
        </view>
        <wd-radio-group v-model="innerDate" type="button">
          <wd-radio v-for=" dt in dateTypes" :key="dt.value" :value="dt.value">
            {{ dt.label }}
          </wd-radio>
        </wd-radio-group>
      </view>
    </view>
  </bottom-popup>
</template>

<style lang="scss" scoped>
.filter-content-title {
  @apply font-bold pb-2;
}
</style>
