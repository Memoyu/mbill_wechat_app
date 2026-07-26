<script setup lang="ts">
import type { IBill } from '@/api/types/bill'

defineOptions({
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared',
  },
})

const props = defineProps<{
  bill: IBill
}>()
const emit = defineEmits([''])
const show = defineModel<boolean>()

const dateOptions = ref([
  {
    label: '全部时间',
    value: '',
  },
  {
    label: '最近一周',
    value: '7',
  },
  {
    label: '最近一个月',
    value: '30',
  },
  {
    label: '最近三个月',
    value: '90',
  },
  {
    label: '自定义',
    value: '-1',
  },
])
const ledgerOptions = ref([])
const accountOptions = ref([])
const categoryOptions = ref([])

const date = ref('')
const ledgerId = ref('')
const accountId = ref('')
const categoryId = ref('')
const search = ref('')

const selectedIds = ref<string[]>([])

function handleDateChange() {
}

function handleLedgerChange() {
}

function handleAccountChange() {
}

function handleCategoryChange() {
}

function handleConfirm() {

}
</script>

<template>
  <!-- 退款列表 -->
  <center-popup v-model="show" title="关联账单" @confirm="handleConfirm">
    <view class="min-h-[50vh]">
      <wd-drop-menu>
        <wd-drop-menu-item v-model="date" :options="dateOptions" @change="handleDateChange" />
        <wd-drop-menu-item v-model="ledgerId" :options="ledgerOptions" @change="handleLedgerChange" />
        <wd-drop-menu-item v-model="categoryId" :options="categoryOptions" @change="handleAccountChange" />
        <wd-drop-menu-item v-model="accountId" :options="accountOptions" @change="handleCategoryChange" />
      </wd-drop-menu>

      <wd-input v-model="search" type="text" placeholder="关键词" />
    </view>
  </center-popup>
</template>

<style lang="scss" scoped>

</style>
