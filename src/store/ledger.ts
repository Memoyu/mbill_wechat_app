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

    /**
     * 加载账本数据
     */
    const loadLedgers = async () => {
      state.ledgers = await getLedgerList()
      // 在没有选中任何账本时，默认选中第一个账本
      if (state.ledgers && state.ledgers.length > 0 && ledgerPickerStore.selectedLedgers.length < 1)
        ledgerPickerStore.toggleLedgerSelection(state.ledgers[0].ledgerId)
    }

    /**
     * 创建账本
     * @param name 账本名称
     * @param color 颜色
     */
    const createLedger = async (name: string, color: number) => {
      const ledger = await fetchCreateLedger({ name, color })
      state.ledgers.push(ledger)
    }

    /**
     * 加入账本
     * @param ledgerId 账本id
     */
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
          })
          .then(() => {
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
          })
          .catch(() => {
          })
      }).catch(() => {
        toast.error('账本不存在')
      })
    }

    /**
     * 排序账本
     * @param ledgers 排序后的账本
     */
    const sortLedger = (ledgers: ILedger[]) => {
      const sorts = ledgers.map((item, index) => {
        return {
          ledgerId: item.ledgerId,
          sort: index,
        }
      })
      fetchSortLedger(sorts).then(() => {
        state.ledgers = ledgers
      })
    }

    /**
     * 更新账本
     * @param update 更新内容
     */
    const updateLedger = async (update: IUpdateLedger) => {
      await fetchdaUpteLedger(update)
      // 更新
      const ledger = state.ledgers.find(item => item.ledgerId === update.ledgerId)
      if (ledger) {
        ledger.name = update.name
      }
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

    /**
     * 删除账本
     * @param ledgerId 账本id
     */
    const deleteLedger = (ledgerId: string) => {
      fetchDeleteLedger(ledgerId).then(() => {
        const index = state.ledgers.findIndex(l => l.ledgerId === ledgerId)
        state.ledgers.splice(index, 1)
      })
    }

    /**
     * 获取账本颜色
     * @param ledgerId 账本id
     */
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
