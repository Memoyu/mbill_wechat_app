<script setup lang="ts">
import { useUserStore } from '@/store'

const show = defineModel<boolean>()

const userStore = useUserStore()

const user = computed(() => userStore.userInfo)

function handleCancelClick() {
  show.value = false
}
</script>

<template>
  <wd-popup
    v-model="show"
    :close-on-click-modal="true"
    :safe-area-inset-bottom="true"
    custom-class="rounded-t-3xl relative h-60vh"
    lock-scroll
    @close="handleCancelClick"
  >
    <view class="h-full overflow-auto">
    <!--  -->
    </view>
  </wd-popup>
</template>

<style lang="scss" scoped>
.user-block {
  @apply: bg-whit flex flex-col gap-2 overflow-hidden border border-gray-100 rounded-2xl mb-5;
  box-shadow:
    0 8px 20px -6px rgba(0, 0, 0, 0.06),
    0 4px 12px -4px rgba(0, 0, 0, 0.03);
}
</style>
