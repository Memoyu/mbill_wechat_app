<script setup lang="ts">
import type { ILedger } from '@/api/types/ledger'
import lodash from 'lodash'
import { useLedgerStore } from '@/store'

defineOptions({
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared',
  },
})

const props = withDefaults(defineProps<{
  height?: string
}>(), {
  height: '60vh',
})
const emit = defineEmits(['confirm'])
const selecteds = defineModel<string[]>()
const visible = defineModel<boolean>('visible')

const ledgerStore = useLedgerStore()
const ledgers = computed(() => ledgerStore.ledgers)

const isAllSelected = ref()
const innerSelecteds = ref<string[]>([])

watch(() => selecteds.value, (newValue) => {
  if (newValue)
    innerSelecteds.value = lodash.cloneDeep(newValue)
}, { immediate: true, deep: true })

watch(() => visible.value, (newValue) => {
  // 重置选中项
  if (newValue)
    innerSelecteds.value = lodash.cloneDeep(selecteds.value ?? [])
}, { immediate: true })

function handleAfterEnter() {
  // console.log('handleAfterEnter')
}

function handleConfirm() {
  selecteds.value = innerSelecteds.value
  emit('confirm', ledgers.value.filter(ledger => isSelected(ledger)))
}

function isSelected(ledger: ILedger) {
  return innerSelecteds.value.includes(ledger.ledgerId) || false
}

function handleAllSelectClick() {
  if (isAllSelected.value) {
    innerSelecteds.value = []
  }
  else {
    innerSelecteds.value = ledgerStore.ledgers.map(l => l.ledgerId)
  }
  isAllSelected.value = !isAllSelected.value
}

function handleLedgerClick(ledger: ILedger) {
  // console.log(ledger, 'ledger')
  if (isSelected(ledger)) {
    innerSelecteds.value = innerSelecteds.value.filter(id => id !== ledger.ledgerId)
  }
  else {
    innerSelecteds.value.push(ledger.ledgerId)
  }
}
</script>

<template>
  <bottom-popup v-model="visible" title="账本选择" :height="height" @confirm="handleConfirm" @after-enter="handleAfterEnter">
    <template #action>
      <view
        class="px-3 py-1 text-base text-gray-400"
        hover-class="bg-gray-50"
        :hover-start-time="0"
        :hover-stay-time="200"
        @tap="handleAllSelectClick"
      >
        <text>{{ isAllSelected ? '取消全选' : '全选' }}</text>
      </view>
    </template>

    <!-- 账单列表 -->
    <view class="px-2">
      <scroll-view scroll-y class="h-full">
        <view class="p-2 space-y-1.5">
          <view
            v-for="ledger in ledgers" :key="ledger.ledgerId"
            class="mb-block-bg relative flex items-center gap-3 border rounded-md p-3 transition-all"
            @tap="handleLedgerClick(ledger)"
          >
            <view class="flex flex-1 items-center gap-3">
              <view
                class="truncate text-sm"
                :class="[isSelected(ledger) ? 'text-[var(--wot-primary-6)] font-medium' : 'text-gray-700']"
              >
                {{ ledger.name }}
              </view>
            </view>

            <checked-mask :value="isSelected(ledger)" />
          </view>
        </view>
      </scroll-view>
    </view>
  </bottom-popup>
</template>

<style lang="scss" scoped>

</style>
