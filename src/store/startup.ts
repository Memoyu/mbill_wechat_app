import { defineStore } from 'pinia'
import { ref } from 'vue'

import { useAccountStore } from './account'
import { useCategoryStore } from './category'
import { useIconStore } from './icon'
import { useLedgerStore } from './ledger'
import { useLedgerPickerStore } from './ledgerPicker'
import { useTagStore } from './tag'
import { useTokenStore } from './token'

export const useStartupStore = defineStore('startup', () => {
  const loading = ref(true)
  const progress = ref(0)
  const statusText = ref('正在初始化...')
  const failed = ref(false)
  const errorMsg = ref('')

  /**
   * 启动应用：静默登录 → 并行加载数据
   * 由 App.vue onLaunch 调用，也可由加载页重试按钮调用
   */
  async function startApp() {
    const tokenStore = useTokenStore()
    const ledgerStore = useLedgerStore()
    const ledgerPickerStore = useLedgerPickerStore()
    const categoryStore = useCategoryStore()
    const accountStore = useAccountStore()
    const tagStore = useTagStore()
    const iconStore = useIconStore()

    try {
      // 重置状态
      loading.value = true
      progress.value = 0
      statusText.value = '正在登录...'
      failed.value = false
      errorMsg.value = ''

      // 阶段1：静默登录（0% → 30%）
      try {
        progress.value = 10
        await tokenStore.silentLogin()
        progress.value = 30
      }
      catch (error) {
        console.error('启动登录失败:', error)
        failed.value = true
        errorMsg.value = '登录失败，请检查网络后重试'
        return
      }

      // 阶段2：并行加载数据（30% → 100%）
      statusText.value = '加载数据中...'

      const tasks = [
        { name: '账本', weight: 14, fn: async () => {
          const res = await ledgerStore.loadLedgers()
          if (res && res.length > 0 && ledgerPickerStore.selecteds.length < 1)
            ledgerPickerStore.toggleLedgerSelection(res[0].ledgerId)
        } },
        { name: '分类', weight: 14, fn: () => categoryStore.loadCategories() },
        { name: '账户', weight: 14, fn: () => accountStore.loadAccounts() },
        { name: '标签', weight: 14, fn: () => tagStore.loadTags() },
        { name: '图标', weight: 14, fn: () => iconStore.loadIconCatalogs() },
      ]

      let completedWeight = 0
      const results = await Promise.allSettled(
        tasks.map(async (task) => {
          try {
            await task.fn()
          }
          finally {
            completedWeight += task.weight
            progress.value = 30 + completedWeight
            statusText.value = `加载${task.name}完成...`
          }
        }),
      )

      // 检查结果
      const rejectedCount = results.filter(r => r.status === 'rejected').length
      if (rejectedCount === tasks.length) {
        failed.value = true
        errorMsg.value = '数据加载失败，请检查网络后重试'
        return
      }

      // 全部成功或部分成功（降级展示）
      progress.value = 100
      statusText.value = '加载完成'
      setTimeout(() => {
        loading.value = false
      }, 300)
    }
    catch (error) {
      console.error('启动应用异常:', error)
      failed.value = true
      errorMsg.value = '启动失败，请重试'
    }
  }

  return {
    loading,
    progress,
    statusText,
    failed,
    errorMsg,
    startApp,
  }
})
