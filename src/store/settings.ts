import type { BillTypeEnum } from '@/typings'
import { defineStore } from 'pinia'

interface State {
  vibration: boolean
  dark: boolean
  weather: boolean
  address: boolean
  index: {
    summary: {
      show: boolean
      type?: BillTypeEnum
      date: number
    }
  }
}

const initState: State = {
  vibration: true,
  dark: false,
  weather: false,
  address: false,
  index: {
    summary: {
      show: true,
      date: 0,
    },
  },
}

// 配置
export const useSettingsStore = defineStore(
  'settings',
  () => {
    const state = reactive({ ...initState })

    const updateIndexSummary = (date: number, type?: BillTypeEnum) => {
      state.index.summary.type = type
      state.index.summary.date = date
    }
    return {
      ...toRefs(state),
      updateIndexSummary,
      version: import.meta.env.VITE_APP_VERSION,
    }
  },
  {
    persist: true,
  },
)
