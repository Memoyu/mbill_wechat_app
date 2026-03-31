<script setup lang="ts">
import { formatFloat } from '@/utils'

const show = defineModel<boolean>()
const actions = [{
  title: '账本管理',
  icon: 'i-my-icons-ledger-manage',
  action: () => { uni.navigateTo({ url: '/pages/ledger/index' }) },
}, {
  title: '分类管理',
  icon: 'i-my-icons-category-manage',
  action: () => { uni.navigateTo({ url: '/pages/category/index' }) },
}, {
  title: '账户管理',
  icon: 'i-my-icons-account-manage',
  action: () => { uni.navigateTo({ url: '/pages/account/index' }) },
}, {
  title: '标签管理',
  icon: 'i-my-icons-tag-manage',
  action: () => { uni.navigateTo({ url: '/pages/tag/index' }) },
}]
const days = ref(29200)
const bills = ref(34445223)
const user = ref({
  avatarUrl: 'https://wot-ui.cn/assets/panda.jpg',
  userId: '2233434',
  nickname: 'memoyu',
  email: '<EMAIL>',
  mobile: '12345678901',
  createTime: '2021-01-01',
})

function handleCancelClick() {
  show.value = false
}
</script>

<template>
  <wd-popup
    v-model="show"
    position="bottom"
    :close-on-click-modal="true"
    :safe-area-inset-bottom="true"
    custom-class="rounded-t-3xl relative h-60vh"
    lock-scroll
    @close="handleCancelClick"
  >
    <view class="h-full overflow-auto">
      <!-- 标题栏 -->
      <view class="sticky left-0 right-0 top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-4 py-3">
        <view class="flex items-center">
          <wd-avatar :size="40" :src="user.avatarUrl || ''" />
          <view class="ml-3 flex flex-col">
            <text class="text-base font-semibold">{{ user.nickname || '未登录' }}</text>
            <text class="text-xs text-gray-400 font-bold">已坚持记账{{ formatFloat(days, 0) }}天，共{{ formatFloat(bills, 0) }}条账单</text>
          </view>
        </view>
      </view>

      <!-- 用户信息 -->
      <view class="px-4">
        <view class="user-block">
          <view class="flex items-center justify-between px-4 py-2">
            <text class="font-semibold">用户信息</text>
            <wd-icon name="edit-outline" />
          </view>
          <wd-cell title="ID" size="small" :value="user.userId || '-'" />
          <wd-cell title="邮箱" size="small" :value="user.email || '-'" />
          <wd-cell title="手机" size="small" :value="user.mobile || '-'" />
          <wd-cell title="注册" size="small" :value="user.createTime || '-'" />
        </view>

        <view class="user-block">
          <wd-grid :column="4">
            <wd-grid-item v-for="item in actions" :key="item.title" @tap="item.action">
              <view class="flex flex-col items-center">
                <text class="my-icons text-3xl" :class="[item.icon]" />
                <text>{{ item.title }}</text>
              </view>
            </wd-grid-item>
          </wd-grid>
        </view>

        <view class="user-block">
          <wd-button type="error" custom-class="custom-shadow">
            退出登录
          </wd-button>
        </view>
      </view>
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
