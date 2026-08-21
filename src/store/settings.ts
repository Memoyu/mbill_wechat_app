import type { BillTypeEnum } from '@/typings'
import { defineStore } from 'pinia'

interface State {
  vibration: boolean
  dark: boolean
  weather: boolean
  address: boolean
  index: {
    charts: {
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
    charts: {
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

    const updateIndexCharts = (date: number, type?: BillTypeEnum) => {
      state.index.charts.type = type
      state.index.charts.date = date
    }

    return {
      ...toRefs(state),
      updateIndexCharts,
      version: import.meta.env.VITE_APP_VERSION,
    }
  },
  {
    persist: true,
  },
)
