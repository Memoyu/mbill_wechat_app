<script setup lang="ts">
import type { IAccount } from '@/api/types/account'
import type { IIcon } from '@/api/types/icon'
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

const toast = useToast()
const accountStore = useAccountStore()

const editShow = ref(false)
const editTitle = ref('创建账户')
const scrollHeight = ref(300)
const actionShow = ref(false)
const currentAccount = ref<IAccount>()

const accounts = computed(() => accountStore.accounts)

const editAccount = ref<{
  isCreate: boolean
  name: string
  icon: string
  accountId?: string
  parentId?: string
}>({ isCreate: true, name: '', icon: '' })

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
    isCreate: true,
    name: '',
    icon: '',
    parentId: '',
    accountId: '',
  }
  editTitle.value = '创建账户'
  editAccount.value.isCreate = true
  editShow.value = true
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
    currentAccount.value = child
    actionShow.value = true
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
    isCreate: false,
    name,
    icon,
    accountId,
    parentId,
  }
  editTitle.value = name
  editShow.value = true
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
    isCreate: true,
    name: '',
    icon: '',
    accountId: '',
    parentId: parent.accountId,
  }

  editTitle.value = `${parent.name} 新增子账户`
  editShow.value = true
}

/**
 * 分类图标选择
 */
function handleIconSelected(icon: IIcon) {
  editAccount.value.icon = icon.url
  // console.log('handleIconSelected', icon, editCategory.value)
}

/**
 * 创建/编辑分类
 */
async function handleEditConfirm(check: (close: boolean) => void) {
  const { isCreate, accountId, name, icon, parentId } = editAccount.value

  if (!checkAccount(editAccount.value))
    return check(false)
  if (!isCreate && !accountId) {
    toast.error('账户ID不能为空')
    return check(false)
  }

  if (isCreate) {
    await accountStore.createAccount(name, icon, parentId)
  }
  else {
    await accountStore.updateAccount({ accountId, name, icon }, parentId)
  }

  return check(true)
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
  <page-meta :page-style="`overflow:${editShow ? 'hidden' : 'visible'};`" />
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
              <bill-icon size="22px" :icon="listItem.icon" :text="listItem.name" />
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
              :column="5"
              :init-height="62"
              :list="listItem.childs"
              key-prop="accountId"
              @change="list => handleChildSortChange(list, listItem)"
              @tap="data => handleChildItemTap(listItem, data)"
            >
              <template #content="{ gridItem }">
                <view class="flex flex-col items-center p-2">
                  <bill-icon :icon="gridItem.icon" :text="gridItem.name" />
                  <view class="account-item-title line-clamp-1 mt-1 mt-1 text-nowrap">
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

  <!-- 编辑账户 -->
  <bottom-popup v-model="editShow" :title="editTitle" confirm-text="确认" show-cancel @confirm="handleEditConfirm">
    <template #title>
      <view class="flex items-center pb-2 pt-4">
        <!-- <wd-img :width="32" :height="32" :src="editCategory.icon" round :lazy-load="true" :show-error="false" :show-loading="false" /> -->
        <bill-icon :icon="editAccount.icon" :text="editAccount.name" />
        <wd-input v-model="editAccount.name" type="text" placeholder="分类名称" custom-class="custom-input" />
      </view>
    </template>

    <view>
      <icon-picker @selected="handleIconSelected" />
    </view>
  </bottom-popup>
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
