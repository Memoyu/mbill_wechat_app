<script setup lang="ts">
import type { IAccount } from '@/api/types/account'
import type { ActionGroup, ActionItem } from '@/typings'
import { useDialog, useToast } from '@wot-ui/ui'
import { icons } from '@/constants/billIcons'
import { useAccountStore } from '@/store'
import { systemInfo } from '@/utils/systemInfo'

definePage({
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '账户管理',
  },
})

const navActions: ActionItem[] = [
  {
    text: '创建',
    icon: 'plus',
    action: handleCreateAction,
  },
]
const accountActions: ActionGroup[] = [
  {
    actions: [
      {
        icon: 'i-carbon-edit',
        text: '编辑账户',
        action: handleEditAction,
      },
      {
        icon: 'i-carbon-package',
        text: '新增子账户',
        action: handleCreateChildAction,
      },
      {
        icon: 'i-carbon-trash-can',
        text: '删除账户',
        type: 'danger',
        action: handleDeleteAction,
      },
    ],
  },
]

const editDialog = useDialog('account-edit-dialog')
const toast = useToast()
const accountStore = useAccountStore()

const show = ref(false)
const scrollHeight = ref(300)
const actionShow = ref(false)
const currentAccount = ref<IAccount>()

const accounts = computed(() => accountStore.accounts)

const editAccount = ref<{
  name: string
  icon: string
}>({ name: '', icon: '' })

onMounted(() => {
  // 进入管理页面重新加载一下数据
  accountStore.loadAccounts()
  nextTick(() => {
    uni.createSelectorQuery().select('#TOP_NAVBAR').boundingClientRect((data: any) => {
      scrollHeight.value = systemInfo.windowHeight - (data.height + 16) // 16为外层view的padding
    }).exec()
  })
})

/**
 * 新增账户Action触发
 */
function handleCreateAction() {
  // console.log('handleCreateTap')
  editAccount.value = {
    name: '',
    icon: '',
  }
  editDialog.confirm({
    title: '新增',
    beforeConfirm: () => {
      return checkAccount(editAccount.value)
    },
  }).then(async () => {
    const { name, icon } = editAccount.value
    await accountStore.createAccount(name, icon)
  }).catch(() => {
    // console.log('点击了取消')
  })
}

/**
 * 账户编辑参数检查
 */
function checkAccount(data: any) {
  // console.log('checkAccount', data)
  if (!data.name || data.name.length < 1) {
    toast.error('账户名称不能为空')
    return false
  }

  if (!data.icon || data.icon.length < 1) {
    toast.error('账户图标不能为空')
    return false
  }

  return true
}

/**
 * 账户排序触发
 */
function handleSortChange(list: IAccount[]) {
  // console.log('handleSortChange', list)
  accountStore.sortAccount(list)
}

/**
 * 账户子项排序触发
 */
function handleChildSortChange(list: IAccount[], parent: any) {
  // console.log('handleChildSortChange', list, parent as IAccount)
  parent = parent as IAccount
  accountStore.sortAccount(list, parent.accountId)
}

/**
 * 账户项点击
 */
function handleChildItemTap(parent: any, data: any) {
  const { item, type } = data
  parent = parent as IAccount
  const child = item as IAccount

  if (type === 'add') {
    createChildAccount(parent)
  }
  else {
    // 展示操作面板
    handleAccountActions(child)
  }
}

/**
 * 账户操作面板展示
 */
function handleAccountActions(item: any) {
  currentAccount.value = item as IAccount
  actionShow.value = true
}

/**
 * 编辑账户Action触发
 */
function handleEditAction() {
  // console.log('handleEditAction')

  if (!currentAccount.value)
    return
  const { accountId, name, icon, parentId } = currentAccount.value

  editAccount.value = {
    name,
    icon,
  }

  editDialog.confirm({
    title: name,
    beforeConfirm: () => {
      return checkAccount(editAccount.value)
    },
  }).then(async () => {
    const { name, icon } = editAccount.value
    await accountStore.updateAccount({ accountId, name, icon }, parentId)
  }).catch(() => {
    // console.log('点击了取消')
  })
}

/**
 * 新增子账户Action触发
 */
function handleCreateChildAction() {
  // console.log('handleCreateChildAction')
  if (!currentAccount.value)
    return
  createChildAccount(currentAccount.value)
}

/**
 * 创建子账户
 */
function createChildAccount(parent: IAccount) {
  // console.log('handleChildAdd', parent)
  editAccount.value = {
    name: '',
    icon: '',
  }

  editDialog.confirm({
    title: `${parent.name} 新增子账户`,
    beforeConfirm: () => {
      return checkAccount(editAccount.value)
    },
  }).then(async () => {
    const { name, icon } = editAccount.value
    await accountStore.createAccount(name, icon, parent.accountId)
  }).catch(() => {
    // console.log('点击了取消')
  })
}

/**
 * 删除账户Action触发
 */
function handleDeleteAction() {
  // console.log('handleEditAction')
  if (!currentAccount.value)
    return
  accountStore.deleteAccount(currentAccount.value.accountId, currentAccount.value.parentId)
}
</script>

<template>
  <page-meta :page-style="`overflow:${show ? 'hidden' : 'visible'};`" />
  <draw-background2 />
  <nav-bar id="TOP_NAVBAR" :actions="navActions" title="账户管理" />
  <view class="w-screen">
    <view class="p-2">
      <drag-sort-list-view expand :gap="8" :list="accounts" key-prop="accountId" :height="scrollHeight" @change="handleSortChange">
        <template #title="{ listItem }">
          <view class="account-title-box">
            <view class="flex items-center justify-between">
              <view class="mr-3">
                <wd-icon v-if="listItem.expand" name="caret-down" />
                <wd-icon v-else name="caret-right" />
              </view>
              <mbill-icon size="20px" :icon="listItem.icon" />
              <view class="ml-1 flex-1 font-bold">
                {{ listItem.name }}
              </view>

              <view
                class="h-6 w-6 flex items-center justify-center rounded-full bg-white/40 shadow-[0_4px_8px_rgba(0,0,0,0.04)]"
                @tap.stop="handleAccountActions(listItem)"
              >
                <wd-icon name="more" />
              </view>
            </view>
          </view>
        </template>
        <template #content="{ listItem }">
          <view class="account-content-box">
            <drag-sort-grid-view
              :gap="8"
              :column="4"
              :init-height="62"
              :list="listItem.childs"
              key-prop="accountId"
              @change="list => handleChildSortChange(list, listItem)"
              @tap="data => handleChildItemTap(listItem, data)"
            >
              <template #content="{ gridItem }">
                <view class="flex flex-col items-center p-2">
                  <mbill-icon :icon="gridItem.icon" />
                  <view class="account-item-title mt-1">
                    {{ gridItem.name }}
                  </view>
                </view>
              </template>
            </drag-sort-grid-view>
          </view>
        </template>
      </drag-sort-list-view>
    </view>
  </view>

  <!-- 更多操作 -->
  <action-popup
    v-model="actionShow"
    :title="currentAccount?.name || ''"
    :items="accountActions"
  />

  <!-- 编辑账本 -->
  <wd-dialog selector="account-edit-dialog">
    <wd-input v-model="editAccount.name" type="text" placeholder="账户名称" custom-class="custom-input" />

    <!-- 图标选择 -->
    <view class="mt-2 h-50 overflow-y-auto p-2">
      <view class="grid grid-cols-5 gap-4">
        <view
          v-for="icon in icons"
          :key="icon"
          class="bill-icons flex content-center justify-center rounded-md p-2 text-center text-6 shadow-sm transition-all duration-200"
          :class="[editAccount.icon === icon ? 'ring-2 ring-indigo-500 ring-offset-2' : '', icon]"
          hover-class="scale-95 shadow-md"
          :hover-start-time="0"
          :hover-stay-time="200"
          @tap="editAccount.icon = icon"
        />
      </view>
    </view>
  </wd-dialog>
</template>

<style lang="scss" scoped>
.account-title-box {
  box-sizing: border-box;
  padding: 0.9rem;
  @apply bg-indigo-50/60;
}

.account-content-box {
  @apply bg-indigo-50/60 p-2;
}
.account-item-title {
  font-size: 12px;
}
</style>
