<script setup lang="ts">
import type { ILedger } from '@/api/types/ledger'
import { useLedgerStore, useSettingsStore } from '@/store'

defineOptions({
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared',
  },
})

const props = defineProps<{
}>()
const emit = defineEmits(['confirm'])
const show = defineModel<boolean>()

const ledgerStore = useLedgerStore()
const settingsStore = useSettingsStore()

const mounted = ref(false)
const showLedgerPicker = ref(false)
const ledgerName = ref<string>('')
const innerLedgers = ref<string[]>([])

const config = computed(() => settingsStore.statis)

watch(() => show.value, (newVal) => {
  if (newVal) {
    mounted.value = true
    innerLedgers.value = config.value.ledgers
    formatLedgerName(config.value.ledgers)
  }
})

function handleConfirm() {
  settingsStore.updateStatis(innerLedgers.value)
  show.value = false
  emit('confirm', config.value)
}

function handleLedgerConfirm(ledgers: ILedger[]) {
  showLedgerPicker.value = false
  formatLedgerName(ledgers.map(l => l.ledgerId))
}

function formatLedgerName(ledgers: string[]) {
  ledgerName.value = ledgerStore.ledgers.filter(l => ledgers.includes(l.ledgerId)).map(l => l.name).join(', ')
}
</script>

<template>
  <!-- <bottom-popup v-model="show" height="40vh" title="更多配置" @confirm="handleConfirm">
    <view class="mb-3 flex flex-col p-3 space-y-2">
      <view>
        <view class="more-content-title">
          所属账本
        </view>
        <view class="rounded-sm bg-[var(--wot-input-bg)] p-3" @tap="showLedgerPicker = true">
          <text v-if="!ledgerName || ledgerName.length <= 0" class="text-[#b1b4bf]">账本</text>
          <text v-else class="line-clamp-1">{{ ledgerName }}</text>
        </view>
      </view>
    </view>
  </bottom-popup> -->

  <!-- 账本选择器 -->
  <ledger-list-picker v-if="mounted" v-model="innerLedgers" v-model:visible="show" height="50vh" @confirm="handleConfirm" />
</template>

<style lang="scss" scoped>
:deep(.wd-radio.is-button) {
  margin: 0px 8px 0px 0px;
}
.more-content-title {
  @apply font-bold pb-2;
}
</style>
