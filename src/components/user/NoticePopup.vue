<script setup lang="ts">
import type { INotice } from '@/api/types/notice'
import dayjs from 'dayjs'
import { useUserStore } from '@/store'

defineOptions({
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared',
  },
})

const props = defineProps<{
  notices?: INotice[]
}>()

const show = defineModel<boolean>()
const userStore = useUserStore()

const noticeStyles = ref<Record<string, string>>({
  'notice-highlight': 'background-color:var(--wot-success-surface);color:var(--wot-success-main);padding:0 4px;',
})

function handleClose() {
  userStore.setNotices(props.notices.map(n => n.id))
}
</script>

<template>
  <bottom-popup
    v-model="show"
    :show-btn="false"
    title="通知"
    @close="handleClose"
  >
    <view class="space-y-4">
      <view v-for="n in notices" :key="n.id" class="relative w-full">
        <wd-card :title="n.title">
          <view class="content-text">
            <wd-rich-text
              :class-styles="noticeStyles"
              :content="n.content"
            />
          </view>
          <view class="mt-3 text-right text-xs text-gray-500">
            {{ `${dayjs(n.createTime).format('YYYY-MM-DD HH:mm')}` }}
          </view>
        </wd-card>
        <!-- 未读标识 -->
        <view v-if="!userStore.state.notices.includes(n.id)" class="absolute left-6 top-0">
          <wd-badge is-dot />
        </view>
      </view>
    </view>
  </bottom-popup>
</template>

<style lang="scss" scoped>

</style>
