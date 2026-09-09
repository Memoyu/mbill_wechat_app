import type { BillTypeEnum } from '@/typings'
import { defineStore } from 'pinia'
import { useLedgerPickerStore } from './ledgerPicker'

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
  calendar: {
    ledgers: string[]
    heatMap: number
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
  calendar: {
    ledgers: [],
    heatMap: -1,
  },
}

// 配置
export const useSettingsStore = defineStore(
  'settings',
  () => {
    const ledgerPickerStore = useLedgerPickerStore()
    const state = reactive({ ...initState, calendar: { ...initState.calendar, ledgers: ledgerPickerStore.selectedLedgers } })

    const updateIndexCharts = (date: number, type?: BillTypeEnum) => {
      state.index.charts.type = type
      state.index.charts.date = date
    }

    const updateCalendar = (ledgers: string[], heatMap: number) => {
      state.calendar.ledgers = ledgers
      state.calendar.heatMap = heatMap
    }

    return {
      ...toRefs(state),
      updateIndexCharts,
      updateCalendar,
      version: import.meta.env.VITE_APP_VERSION,
    }
  },
  {
    persist: true,
  },
)
