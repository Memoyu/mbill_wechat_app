import { defineStore } from 'pinia'
import { useLedgerStore } from './ledger'

// 初始化状态
const initState = {
  isAllSelected: false,
  selectedLedgers: [],
}

export const useLedgerPickerStore = defineStore(
  'ledger-picker',
  () => {
    const ledgerStore = useLedgerStore()
    const state = reactive({ ...initState })

    const toggleLedgerSelection = (ledgerId: string) => {
      const selectedIds = state.selectedLedgers
      const index = selectedIds.indexOf(ledgerId)
      state.isAllSelected = false

      if (index === -1) {
        selectedIds.push(ledgerId)
        state.isAllSelected = selectedIds.length === ledgerStore.ledgers.length
      }
      else {
        selectedIds.splice(index, 1)
      }
    }

    const selectAllLedgers = () => {
      if (state.isAllSelected) {
        state.selectedLedgers = []
      }
      else {
        state.selectedLedgers = ledgerStore.ledgers.map(l => l.ledgerId)
      }

      state.isAllSelected = !state.isAllSelected
    }

    const isLedgerSelected = (ledgerId: string) => {
      // console.log('校验选中')
      return state.selectedLedgers.includes(ledgerId) || false
    }

    return {
      ...toRefs(state),
      toggleLedgerSelection,
      selectAllLedgers,
      isLedgerSelected,
    }
  },
  {
    persist: true,
  },
)
