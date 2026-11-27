<script lang="ts" setup>
import { useLedgerPickerStore } from '@/store'

defineOptions({
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared',
  },
})

const emit = defineEmits(['showLedgers'])

const ledgerPickerStore = useLedgerPickerStore()

const ledgerName = computed(() => ledgerPickerStore.selectedNames.join(', '))

function handleNavigateTo(path: string) {
  uni.navigateTo({ url: path })
}
</script>

<template>
  <view class="fixed bottom-8 left-0 right-0 z-2 mx-auto w-90% flex animate-fade-in-up animate-duration-400 animate-ease-out">
    <view
      class="mb-backdrop-blur-bg flex flex-1 items-center justify-between rounded-full p-2"
      :style="{ boxShadow: '0 8px 24px -6px rgba(0,0,0,0.12), 0 4px 8px -4px rgba(0,0,0,0.08)' }"
    >
      <view class="flex items-center gap-3">
        <!-- 账本按钮 -->
        <view
          class="index-navbar-action"
          hover-class="index-navbar-action-hover"
          :hover-start-time="0"
          :hover-stay-time="200"
          @tap="emit('showLedgers')"
        >
          <text class="i-lucide-notebook-text" />
          <text class="max-w-[80px] truncate text-sm"> {{ ledgerName }} </text>
        </view>

        <view
          class="index-navbar-action"
          hover-class="index-navbar-action-hover"
          :hover-start-time="0"
          :hover-stay-time="200"
          @tap="handleNavigateTo('/pages/statis/index')"
        >
          <text class="i-lucide-chart-pie" />
          <text class="text-sm">统计</text>
        </view>
      </view>

      <view
        class="index-navbar-action index-navbar-add-action"
        hover-class="index-navbar-action-hover"
        :hover-start-time="0"
        :hover-stay-time="200"
        @tap="handleNavigateTo('/pages/bill/edit')"
      >
        <text class="i-lucide-plus" />
        <text class="text-sm font-medium">添加</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.index-navbar-action {
  @apply: flex items-center gap-2 rounded-full mb-active-bg px-3 py-2 transition-colors;
}

.index-navbar-add-action {
  @apply relative text-[var(--wot-primary-5)];
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--wot-primary-2);
    border-radius: inherit;
    z-index: -1;
    opacity: 0.4;
  }
}

.index-navbar-action-hover {
  @apply: !scale-95 transform-origin-center;
}
</style>
