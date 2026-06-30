import type { Dialog } from '@wot-ui/ui/components/wd-dialog/types'
import type { Toast } from '@wot-ui/ui/components/wd-toast/types'
import type { ILedger, IUpdateLedger, IUpdateLedgerColor } from '@/api/types/ledger'
import lodash from 'lodash'
import { defineStore } from 'pinia'
import {
  createLedger as fetchCreateLedger,
  updateLedger as fetchdaUpteLedger,
  updateLedgerColor as fetchdaUpteLedgerColor,
  deleteLedger as fetchDeleteLedger,
  joinLedger as fetchJoinLedger,
  sortLedger as fetchSortLedger,
  getLedger,
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

    const joinLedger = (dialog: Dialog, toast: Toast, ledgerId: string) => {
      getLedger(ledgerId).then((ledger) => {
        dialog
          .confirm({
            title: '确认加入',
            msg: `你即将加入 ${ledger.creater.nickname} 的[${ledger.name}]账本`,
            theme: 'text',
            actionLayout: 'vertical',
            confirmButtonText: '确认加入',
            cancelButtonText: '取消',
            beforeConfirm: () => {
              toast.loading('加入中...')
              return new Promise((resolve) => {
                fetchJoinLedger(ledger.ledgerId).then((res) => {
                  toast.success('加入成功')
                  state.ledgers.push(res)
                  resolve(true)
                }).catch(() => {
                  resolve(false)
                }).finally (() => {
                  toast.close()
                })
              })
            },
          })
          .then(() => {
            console.log('支付成功')
          })
          .catch(() => {
          })
      }).catch(() => {
        toast.error('账本不存在')
      })
    }

    /**
     * 排序账本
     * @param ledgers
     */
    const sortLedger = (ledgers: ILedger[]) => {
      // state.ledgers = ledgers
      const sorts = ledgers.map((item, index) => {
        const ledger = state.ledgers.find(l => l.ledgerId === item.ledgerId)
        if (ledger) {
          ledger.sort = index
        }

        return {
          ledgerId: item.ledgerId,
          sort: index,
        }
      })
      fetchSortLedger(sorts).then(() => {

      })
    }

    const updateLedger = async (update: IUpdateLedger) => {
      const temp = state.ledgers.map((item) => {
        if (item.ledgerId === update.ledgerId) {
          item.name = update.name
          item.color = update.color
        }
        return item
      })
      state.ledgers = lodash.cloneDeep(temp)
      await fetchdaUpteLedger(update)
    }

    // 修改账本颜色
    const updateLedgerColor = async (ledgers: IUpdateLedgerColor[]) => {
      for (const { ledgerId, color } of ledgers) {
        const ledger = state.ledgers.find(l => l.ledgerId === ledgerId)
        if (ledger) {
          ledger.color = color
        }
      }

      await fetchdaUpteLedgerColor(ledgers)
    }

    const deleteLedger = (ledgerId: string) => {
      fetchDeleteLedger(ledgerId).then(() => {
        const index = state.ledgers.findIndex(l => l.ledgerId === ledgerId)
        state.ledgers.splice(index, 1)
      })
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
      joinLedger,
      sortLedger,
      updateLedger,
      updateLedgerColor,
      deleteLedger,
      getLedgerColor,
    }
  },
)
