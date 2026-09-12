import { defineStore } from 'pinia'
import { useLedgerStore } from './ledger'

// 初始化状态
const initState: {
  selecteds: string[]
  selectedNames: string[]
} = {
  selecteds: [],
  selectedNames: [],
}

export const useLedgerPickerStore = defineStore(
  'ledger-picker',
  () => {
    const toast = useGlobalToast()
    const ledgerStore = useLedgerStore()
    const state = reactive({ ...initState })

    const toggleLedgerSelection = (ledgerId: string) => {
      const selectedIds = state.selecteds
      const index = selectedIds.indexOf(ledgerId)

      if (index === -1) {
        selectedIds.push(ledgerId)
      }
      else {
        if (selectedIds.length === 1) {
          toast.warning('请至少选择一个账本')
          return
        }
        selectedIds.splice(index, 1)
      }
      updateSelectedLedgerNames()
    }

    const selectAllLedgers = () => {
      state.selecteds = ledgerStore.ledgers.map(l => l.ledgerId)
      updateSelectedLedgerNames()
    }

    const isLedgerSelected = (ledgerId: string) => {
      // console.log('校验选中')
      return state.selecteds.includes(ledgerId) || false
    }

    function updateSelectedLedgerNames() {
      state.selectedNames = []
      ledgerStore.ledgers.forEach((ledger) => {
        if (state.selecteds.includes(ledger.ledgerId)) {
          state.selectedNames.push(ledger.name)
        }
      })
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
