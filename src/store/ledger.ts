import type { ILedger, IUpdateLedger, IUpdateLedgerColor } from '@/api/types/ledger'
import { defineStore } from 'pinia'
import {
  createLedger as fetchCreateLedger,
  updateLedger as fetchUpdateLedger,
  updateLedgerColor as fetchUpdateLedgerColor,
  getLedgerList,
} from '@/api/ledger'
import { gradients } from '@/constants/gradients'
import { useLedgerPickerStore } from './ledgerPicker'

// 初始化状态
const initState: {
  ledgers: ILedger[]
} = {
  ledgers: [],
}

function getRandomColor() {
  return Math.floor(Math.random() * gradients.length)
}

export const useLedgerStore = defineStore(
  'ledger',
  () => {
    const ledgerPickerStore = useLedgerPickerStore()
    const state = reactive({ ...initState })

    const loadLedgers = async () => {
      state.ledgers = await getLedgerList()
      // 在没有选中任何账本时，默认选中第一个账本
      if (state.ledgers && state.ledgers.length > 0 && ledgerPickerStore.selectedLedgers.length < 1)
        ledgerPickerStore.toggleLedgerSelection(state.ledgers[0].ledgerId)
    }

    const createLedger = async (name: string, color: number) => {
      const ledger = await fetchCreateLedger({ name, color })
      state.ledgers.push(ledger)
    }

    const updateLedger = async (update: IUpdateLedger) => {
      await fetchUpdateLedger(update)
      state.ledgers.forEach((item, index, arr) => {
        if (item.ledgerId === update.ledgerId) {
          arr[index].name = update.name
          arr[index].color = update.color
        }
      })
    }

    // 修改账本颜色
    const updateLedgerColor = async (ledgers: IUpdateLedgerColor[]) => {
      for (const { ledgerId, color } of ledgers) {
        const ledger = state.ledgers.find(l => l.ledgerId === ledgerId)
        if (ledger) {
          ledger.color = color
        }
      }

      await fetchUpdateLedgerColor(ledgers)
    }

    // 获取账本颜色
    const getLedgerColor = (ledgerId: string) => {
      const ledger = state.ledgers.find(l => l.ledgerId === ledgerId)
      if (!ledger) {
        return 0
      }

      if (ledger.color === undefined) {
        // 如果没有颜色，随机生成一个并保存
        const randomColor = getRandomColor()
        ledger.color = randomColor
        return randomColor
      }

      return ledger.color
    }

    return {
      ...toRefs(state),
      loadLedgers,
      createLedger,
      updateLedger,
      updateLedgerColor,
      getLedgerColor,
    }
  },
)
