import type { IAccount } from '@/api/types/account'
import { defineStore } from 'pinia'
import { getAccountGroup } from '@/api/account'

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

    return {
      ...toRefs(state),
      loadAccounts,
    }
  },
)
