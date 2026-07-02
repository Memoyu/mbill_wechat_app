import type { IAccount, IUpdateAccount } from '@/api/types/account'
import { defineStore } from 'pinia'

import {
  createAccount as fetchCreateAccount,
  deleteAccount as fetchDeleteAccount,
  sortAccount as fetchSortAccount,
  updateAccount as fetchUpdateAccount,
  getAccountGroup,
} from '@/api/account'

// 初始化状态
const initState: {
  accounts: IAccount[]
} = {
  accounts: [],
}

export const useAccountStore = defineStore(
  'account',
  () => {
    const state = reactive({ ...initState })

    /**
     * 加载账单账户数据
     */
    const loadAccounts = async () => {
      state.accounts = await getAccountGroup()
    }

    /**
     * 创建账单账户
     * @param name 账本名称
     * @param color 颜色
     * @param parentId 父账户ID
     */
    const createAccount = async (name: string, icon: string, parentId?: string) => {
      const account = await fetchCreateAccount({ name, icon, parentId })
      account.childs = []

      if (parentId) {
        const parent = state.accounts.find(item => item.accountId === parentId)
        if (parent) {
          parent.childs = parent.childs || []
          parent.childs.push(account)
        }
      }
      else {
        // 添加到根账户下
        state.accounts.push(account)
      }
    }

    /**
     * 排序账单账户
     * @param accounts 排序后的账单账户
     * @param parentId 父账户ID
     */
    const sortAccount = (accounts: IAccount[], parentId?: string) => {
      const sorts = accounts.map((item, index) => {
        return {
          accountId: item.accountId,
          sort: index,
        }
      })
      fetchSortAccount(sorts).then(() => {
        if (parentId) {
          const parent = state.accounts.find(item => item.accountId === parentId)
          if (parent) {
            parent.childs = accounts
          }
        }
        else {
          // 覆盖根账户
          state.accounts = accounts
        }
      })
    }

    /**
     * 更新账本
     * @param update 更新内容
     * @param parentId 父账户ID
     */
    const updateAccount = async (update: IUpdateAccount, parentId?: string) => {
      // 更新数据
      await fetchUpdateAccount(update)

      let list = state.accounts
      // 添加子账户到指定父类下
      if (parentId) {
        const parent = list.find(item => item.accountId === parentId)
        // console.log(parent, 'parent')
        if (parent) {
          list = parent.childs || []
        }
      }

      // 更新账户
      const account = list.find(item => item.accountId === update.accountId)
      if (account) {
        // console.log(account, 'account')
        account.name = update.name
        account.icon = update.icon
      }
    }

    /**
     * 删除账单账户
     * @param accountId 账单id
     * @param parentId 父账户ID
     */
    const deleteAccount = (accountId: string, parentId?: string) => {
      fetchDeleteAccount(accountId).then(() => {
        let list = state.accounts
        // 添加子账户到指定父类下
        if (parentId) {
          const parent = list.find(item => item.accountId === parentId)
          if (parent) {
            list = parent.childs || []
          }
        }

        const index = list.findIndex(l => l.accountId === accountId)
        list.splice(index, 1)
      })
    }

    return {
      ...toRefs(state),
      loadAccounts,
      createAccount,
      sortAccount,
      updateAccount,
      deleteAccount,
    }
  },
)
