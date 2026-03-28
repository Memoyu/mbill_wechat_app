import { defineStore } from 'pinia'

// 初始化状态
const initState = {
  ledgers: [{
    ledgerId: '2323234341',
    name: '日常账本字符222222233333333',
  }, {
    ledgerId: '2323234342',
    name: '学习账单',
  }, {
    ledgerId: '2323234343',
    name: '开店账单',
  }, {
    ledgerId: '2323234344',
    name: '开店账单',
  }, {
    ledgerId: '2323234345',
    name: '开店账单',
  }, {
    ledgerId: '2323234346',
    name: '开店账单',
  }, {
    ledgerId: '2323234347',
    name: '开店账单',
  }, {
    ledgerId: '2323234348',
    name: '开店账单',
  }, {
    ledgerId: '2323234349',
    name: '开店账单',
  }, {
    ledgerId: '2323234350',
    name: '开店账单',
  }],
}

export const useLedgerStore = defineStore(
  'ledger',
  () => {
    const state = reactive({ ...initState })

    return {
      ...toRefs(state),
    }
  },
)
