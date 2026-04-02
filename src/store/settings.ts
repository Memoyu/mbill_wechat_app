import { defineStore } from 'pinia'

interface State {
  vibration: boolean
}

const initState: State = {
  vibration: true,
}

// 配置
export const useSettingsStore = defineStore(
  'settings',
  () => {
    const state = reactive({ ...initState })

    return {
      ...toRefs(state),
      version: import.meta.env.VITE_APP_VERSION,
    }
  },
  {
    persist: true,
  },
)
