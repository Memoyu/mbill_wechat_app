import { createPinia, setActivePinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate' // 数据持久化

const store = createPinia()
store.use(
  createPersistedState({
    storage: {
      getItem: uni.getStorageSync,
      setItem: uni.setStorageSync,
    },
  }),
)
// 立即激活 Pinia 实例, 这样即使在 app.use(store)之前调用 store 也能正常工作 （解决APP端白屏问题）
setActivePinia(store)

export default store

export * from './account'
export * from './category'
export * from './ledger'
export * from './ledgerPicker'
export * from './settings'
export * from './theme'
export * from './token'
export * from './user'
