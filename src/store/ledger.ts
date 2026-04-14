import { defineStore } from 'pinia'

// 初始化状态
const initState = {
  ledgers: [{
    ledgerId: '12323234341',
    name: '日常账本字符222222233333333日常账本字符日常账本字符',
    count: 100,
    createTime: '2024-06-01 12:00:00',
  }, {
    ledgerId: '22323234342',
    name: '学习账单',
    count: 50,
    createTime: '2024-06-02 12:09:00',
  }, {
    ledgerId: '32323234343',
    name: '开店账单1',
    count: 20,
    createTime: '2024-06-03 12:16:00',
  }, {
    ledgerId: '42323234344',
    name: '开店账单2',
    count: 15,
    createTime: '2024-06-04 12:13:00',
  }, {
    ledgerId: '52323234345',
    name: '开店账单3',
    count: 10,
    createTime: '2024-06-05 12:35:00',
  }, {
    ledgerId: '62323234346',
    name: '开店账单4',
    count: 5,
    createTime: '2024-06-06 12:55:00',
  }, {
    ledgerId: '72323234347',
    name: '开店账单5',
    count: 3,
    createTime: '2024-06-07 12:50:00',
  }, {
    ledgerId: '82323234348',
    name: '开店账单6',
    count: 2,
    createTime: '2024-06-08 12:40:00',
  }, {
    ledgerId: '92323234349',
    name: '开店账单7',
    count: 1,
    createTime: '2024-06-09 12:30:00',
  }, {
    ledgerId: '102323234350',
    name: '开店账单8',
    count: 7,
    createTime: '2024-06-10 12:20:00',
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
