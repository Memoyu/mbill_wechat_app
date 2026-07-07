<script setup lang="ts">
import { useDialog } from '@wot-ui/ui'
import dayjs from 'dayjs'
import { uploadAvatar } from '@/api/common'
import { useUserStore } from '@/store'

// TODO 待账单数据完成录入，再进行【年数据统计】开发

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

const dialog = useDialog()
const userStore = useUserStore()

const user = computed(() => userStore.userInfo)

function handleCancelClick() {
  show.value = false
}

function handleChooseAvatar(e: any) {
  if (!e?.detail?.avatarUrl)
    return
  const tempPath = e.detail.avatarUrl
  uploadAvatar(user.value.userId, tempPath).then((url) => {
    userStore.setUserAvatar(url)
  })
}

function handelNicknameInput() {
  dialog
    .prompt({
      title: '修改昵称',
      inputValue: user.value.nickname,
      inputValidate: (value) => {
        value = `${value}`.trim()
        return value && value.length > 0
      },
      inputError: '昵称不能为空',
    })
    .then((res) => {
      // console.log(res.value)
      if (!res.value)
        return
      userStore.setUserNickname(res.value.toString())
    })
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
      <view class="px-4">
        <view class="user-block">
          <view class="flex items-center justify-between px-4 py-2">
            <text class="font-semibold">用户信息</text>
          </view>
          <wd-cell title="ID" :value="user.userId || '-'" />
          <wd-cell title="注册" :value="dayjs(user.createTime).format('YYYY-MM-DD') || '-'" />
        </view>

        <view class="user-block">
          <view class="h-50 text-center">
            年数据统计
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
  <wd-dialog />
</template>

<style lang="scss" scoped>
.user-block {
  @apply: bg-whit flex flex-col gap-2 overflow-hidden border border-gray-100 rounded-2xl mb-5;
  box-shadow:
    0 8px 20px -6px rgba(0, 0, 0, 0.06),
    0 4px 12px -4px rgba(0, 0, 0, 0.03);
}

.avatar-box {
  background: transparent;
  padding: 0;
  &:after {
    border: none;
  }
}
</style>
