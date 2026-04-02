import { defineStore } from 'pinia'

// 初始化状态
const initState = {
  accounts: [{
    accountId: '1231',
    name: '账户1',
  }],
}

export const useAccountStore = defineStore(
  'account',
  () => {
    const state = reactive({ ...initState })

    return {
      ...toRefs(state),
    }
  },
)
