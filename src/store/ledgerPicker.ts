import { defineStore } from 'pinia'
import { useLedgerStore } from './ledger'

// 初始化状态
const initState: {
  isAllSelected: boolean
  selectedLedgers: string[]
  selectedLedgerNames: string[]
} = {
  isAllSelected: false,
  selectedLedgers: [],
  selectedLedgerNames: [],
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
      updateSelectedLedgerNames()
    }

    const selectAllLedgers = () => {
      if (state.isAllSelected) {
        state.selectedLedgers = []
      }
      else {
        state.selectedLedgers = ledgerStore.ledgers.map(l => l.ledgerId)
      }

      state.isAllSelected = !state.isAllSelected
      updateSelectedLedgerNames()
    }

    const isLedgerSelected = (ledgerId: string) => {
      // console.log('校验选中')
      return state.selectedLedgers.includes(ledgerId) || false
    }

    function updateSelectedLedgerNames() {
      state.selectedLedgerNames = []
      for (const id of state.selectedLedgers) {
        const ledger = ledgerStore.ledgers.find(l => l.ledgerId === id)
        if (ledger) {
          state.selectedLedgerNames.push(ledger.name)
        }
      }
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
