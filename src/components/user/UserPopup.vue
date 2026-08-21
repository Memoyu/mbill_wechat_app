<script setup lang="ts">
import dayjs from 'dayjs'
import { uploadAvatar } from '@/api/common'
import { useIndexBillStore, useUserStore } from '@/store'
import { formatFloat, getBillColor } from '@/utils'

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

const userStore = useUserStore()
const indexBillStore = useIndexBillStore()

const editShow = ref(false)
const nickname = ref()

const summary = computed(() => indexBillStore.yearSummary)
const user = computed(() => userStore.userInfo)

/**
 * 选择头像
 */
function handleChooseAvatar(e: any) {
  if (!e?.detail?.avatarUrl)
    return
  const tempPath = e.detail.avatarUrl
  uploadAvatar(user.value.userId, tempPath).then((url) => {
    userStore.setUserAvatar(url)
  })
}

/**
 * 修改昵称
 */
function handelNicknameInput() {
  nickname.value = user.value.nickname
  editShow.value = true
}

/*
 * 昵称修改确认
 */
function handleEditConfirm() {
  userStore.setUserNickname(nickname.value)
  editShow.value = false
}

/**
 * 刷新年汇总统计
 */
function handleSummaryRefresh() {
  indexBillStore.loadYearSummary()
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
  >
    <view class="h-full overflow-auto">
      <!-- 标题栏 -->
      <view class="sticky left-0 right-0 top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-4 py-3">
        <view class="flex items-center">
          <button class="avatar-box" open-type="chooseAvatar" @chooseavatar="handleChooseAvatar">
            <wd-avatar :size="40" :src="user.avatar" />
          </button>
          <view class="ml-3 flex flex-col">
            <text class="text-base font-semibold" @tap="handelNicknameInput">{{ user.nickname || '未登录' }}</text>
            <text class="text-xs text-gray-400 font-bold">已坚持记账{{ user.billDay }}天，共{{ user.billCount }}条账单</text>
          </view>
        </view>
      </view>

      <!-- 用户信息 -->
      <view class="flex flex-col gap-5 px-4">
        <view class="user-block">
          <view class="user-block-title">
            用户信息
          </view>
          <view class="flex flex-col gap-3">
            <view class="flex justify-between">
              <text>ID</text>
              <text class="text-gray-500">
                {{ user.userId || '-' }}
              </text>
            </view>

            <view class="flex justify-between">
              <text>注册</text>
              <text class="text-gray-500">
                {{ dayjs(user.createTime).format('YYYY-MM-DD') || '-' }}
              </text>
            </view>
          </view>
        </view>

        <!-- 年汇总统计 -->
        <view class="user-block">
          <view class="user-block-title flex items-center justify-between">
            <text>年汇总统计</text>
            <view class="flex items-center justify-center rounded-full bg-gray-100/80 p-1" @tap="handleSummaryRefresh">
              <wd-icon name="refresh" size="18" />
            </view>
          </view>
          <view class="flex flex-col gap-3 text-gray-500">
            <view class="flex justify-between">
              <view class="flex flex-col">
                <text>结余</text>
                <text class="text-xl text-indigo font-semibold">
                  {{ formatFloat(summary.surplus) }}
                </text>
              </view>

              <!-- 总金额 -->
              <view class="flex flex-col gap-3">
                <view class="flex gap-1">
                  <text>支出</text>
                  <text class="font-bold" :style="{ color: getBillColor(0) }">
                    {{ formatFloat(summary.expend) }}
                  </text>
                </view>
                <view class="flex gap-1">
                  <text>收入</text>
                  <text class="font-bold" :style="{ color: getBillColor(1) }">
                    {{ formatFloat(summary.income) }}
                  </text>
                </view>
              </view>
            </view>

            <view class="flex justify-between">
              <view class="flex flex-col justify-end gap-3">
                <view class="flex gap-1">
                  <text>日均支出</text>
                  <text class="font-bold" :style="{ color: getBillColor(0) }">
                    {{ formatFloat(summary.expendAvg) }}
                  </text>
                </view>
                <view class="flex gap-1">
                  <text>日均收入</text>
                  <text class="font-bold" :style="{ color: getBillColor(0) }">
                    {{ formatFloat(summary.incomeAvg) }}
                  </text>
                </view>
              </view>

              <view class="flex flex-col justify-end gap-3">
                <view class="flex gap-1">
                  <text>最高支出</text>
                  <text class="font-bold" :style="{ color: getBillColor(0) }">
                    {{ formatFloat(summary.expendHighest) }}
                  </text>
                </view>
                <view class="flex gap-1">
                  <text>最高收入</text>
                  <text class="font-bold" :style="{ color: getBillColor(0) }">
                    {{ formatFloat(summary.incomeHighest) }}
                  </text>
                </view>
              </view>
            </view>
          </view>
        </view>

        <view class="user-block">
          <wd-grid :column="4">
            <wd-grid-item v-for="item in actions" :key="item.title" @tap="item.action">
              <view class="flex flex-col items-center">
                <text class="my-icons text-3xl" :class="[item.icon]" />
                <text class="text-xs">{{ item.title }}</text>
              </view>
            </wd-grid-item>
          </wd-grid>
        </view>

        <!-- 暂不支持退出登录 -->
        <!-- <view class="user-block">
          <wd-button type="danger" custom-class="custom-shadow">
            退出登录
          </wd-button>
        </view> -->
      </view>
    </view>
  </wd-popup>

  <!-- 编辑标签 -->
  <center-popup v-model="editShow" title="修改昵称" @confirm="handleEditConfirm">
    <view class="px-3">
      <wd-input v-model="nickname" type="text" placeholder="用户昵称" />
    </view>
  </center-popup>
</template>

<style lang="scss" scoped>
.user-block {
  @apply: bg-whit py-3 px-4 overflow-hidden border border-gray-100 rounded-2xl;
  box-shadow:
    0 8px 20px -6px rgba(0, 0, 0, 0.06),
    0 4px 12px -4px rgba(0, 0, 0, 0.03);
}
.user-block-title {
  @apply: font-semibold mb-4;
}

.avatar-box {
  background: transparent;
  padding: 0;
  &:after {
    border: none;
  }
}
</style>
