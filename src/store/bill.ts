import type { IBill, IBillDateGroup, IBillPageQuery, IBillSummaryAmountItem, IEditBill } from '@/api/types/bill'
import type { BillTypeEnum } from '@/typings'
import dayjs from 'dayjs'
import { debounce } from 'lodash'
import { defineStore } from 'pinia'
import {
  createBill as fetchCreateBill,
  deleteBill as fetchDeleteBill,
  updateBill as fetchUpdateBill,
  pageBill,
  summaryAmountBill,
} from '@/api/bill'
import { useLedgerPickerStore } from './ledgerPicker'

// 初始化状态
const initState: {
  bills: IBillDateGroup[]
  summary: IBillSummaryAmountItem
  charts: IBillSummaryAmountItem []
  yearSummary: IBillSummaryAmountItem
} = {
  bills: [],
  summary: {
    income: 0,
    expend: 0,
    incomeAvg: 0,
    expendAvg: 0,
    surplus: 0,
    expendHighest: 0,
    expendLowst: 0,
    incomeHighest: 0,
    incomeLowst: 0,
  },
  charts: [],
  yearSummary: {
    income: 0,
    expend: 0,
    incomeAvg: 0,
    expendAvg: 0,
    surplus: 0,
    expendHighest: 0,
    expendLowst: 0,
    incomeHighest: 0,
    incomeLowst: 0,
  },
}

export const useBillStore = defineStore(
  'bill',
  () => {
    const ledgerPickerStore = useLedgerPickerStore()
    const state = reactive({ ...initState })
    const pageQuery = reactive<{ query: IBillPageQuery }>({ query: {} })

    /**
     * 加载账单
     * @param query 查询参数
     */
    const loadBills = debounce(async (query: IBillPageQuery) => {
      pageQuery.query = {
        ...pageQuery.query,
        ...query,
        ledgerIds: ledgerPickerStore.selectedLedgers,
      }

      const res = await pageBill(pageQuery.query)
      state.bills = res.items
    }, 500)

    const loadSummary = async (date: number) => {
      const res = await summaryAmountBill({
        beginDate: dayjs(date).startOf('month').format(),
        endDate: dayjs(date).endOf('month').format(),
        series: 0,
        ledgerIds: ledgerPickerStore.selectedLedgers,
      })
      state.summary = res.summary
    }

    const loadCharts = async (beginDate: string, endDate: string, type?: BillTypeEnum) => {
      const res = await summaryAmountBill({
        beginDate,
        endDate,
        type,
        series: 2,
      })
      state.charts = res.series
    }

    const loadYearSummary = async () => {
      // 本年度金额汇总
      const res = await summaryAmountBill({
        beginDate: dayjs().startOf('year').format('YYYY-MM-DD'),
        endDate: dayjs().endOf('year').format('YYYY-MM-DD'),
        series: 0,
        ledgerIds: [], // 所有账本
      })
      state.yearSummary = res.summary
    }

    /**
     * 获取本地账单
     * @param billId 账单ID
     */
    const getLoaclBill = (billId: string) => {
      // 从本地数据获取账单
      let group
      let bill
      let groupIdx = -1
      let billIdx = -1

      for (let i = 0; i < state.bills.length; i++) {
        const g = state.bills[i]
        const idx = g.items.findIndex(item => item.billId === billId)

        if (idx !== -1) {
          group = g
          bill = g.items[idx]
          groupIdx = i
          billIdx = idx
          break
        }
      }

      return group && bill ? { group, groupIdx, bill, billIdx } : undefined
    }

    /**
     * 插入本地账单
     * @param bill 账单数据
     */
    const insertLocalBill = (edit: IEditBill) => {
      // 判断新增的账单所属账本是否在当前选中的账本中
      if (!ledgerPickerStore.isLedgerSelected(edit.ledger.ledgerId)) {
        return
      }

      const bill: IBill = {
        ...edit,
        billId: edit.billId!,
        refundAmount: 0,
        remark: edit.remark || '',
        location: edit.location || '',
        address: edit.address || '',
        tags: edit.tags || [],
        createTime: new Date(),
      }

      // 维护本地bills数据
      const targetDate = dayjs(bill.date).format('YYYY-MM-DD')
      // 查找是否已存在这天的分组
      let group = state.bills.find(b => dayjs(b.date).format('YYYY-MM-DD') === targetDate)

      if (group) {
        // 如果存在该日期分组，将账单插入到正确位置以保持排序
        group.expend += bill.type === 0 ? bill.amount : 0
        group.income += bill.type === 1 ? bill.amount : 0
        group.items.push(bill)
        group.items.sort((a, b) => dayjs(a.date).isBefore(dayjs(b.date)) ? 1 : -1)
      }
      else {
        // 如果不存在该日期分组，创建新的分组
        group = {
          date: bill.date,
          items: [bill],
          expend: bill.type === 0 ? bill.amount : 0,
          income: bill.type === 1 ? bill.amount : 0,
        }
        state.bills.push(group)
        state.bills.sort((a, b) => dayjs(a.date).isBefore(dayjs(b.date)) ? 1 : -1)
      }
    }

    /**
     * 删除本地账单
     * @param billId 账单ID
     */
    const deleteLocalBill = ({ group, groupIdx, bill, billIdx }: { group: IBillDateGroup, groupIdx: number, bill: IBill, billIdx: number }) => {
      // 删除该条账单
      group.items.splice(billIdx, 1)
      // 更新分组统计数据
      group.expend -= bill.type === 0 ? bill.amount : 0
      group.income -= bill.type === 1 ? bill.amount : 0

      // 判断分组中是否还有账单
      if (group.items.length === 0) {
        // 如果没有账单，则删除该分组
        state.bills.splice(groupIdx, 1)
      }
    }

    const createBill = async (create: IEditBill) => {
      const billId = await fetchCreateBill({
        ...create,
        ledgerId: create.ledger.ledgerId,
        categoryId: create.category.categoryId,
        accountId: create.account.accountId,
        tagIds: (create.tags || []).map(tag => tag.tagId),
      })
      create.billId = billId

      insertLocalBill(create)
    }

    const updateBill = async (update: IEditBill) => {
      const billId = update.billId!
      // 更新数据
      await fetchUpdateBill({
        ...update,
        billId,
        ledgerId: update.ledger.ledgerId,
        categoryId: update.category.categoryId,
        accountId: update.account.accountId,
        tagIds: (update.tags || []).map(tag => tag.tagId),
      })

      // 更新本地数据
      // 获取本地账单
      const local = getLoaclBill(billId)
      // 本地没数据，则不需要处理
      if (!local) {
        return
      }
      const { group, bill } = local

      // 情况1：账期变更
      if (!dayjs(update.date).isSame(dayjs(bill.date))) {
        // 此处进一步判断是日期不一致
        if (!dayjs(update.date).isSame(dayjs(bill.date), 'date')) {
          // 日期不一致，从当前分组中删除账单，然后根据实际日期重新插入
          deleteLocalBill(local)
          insertLocalBill(update)
          return
        }
        else {
          // 否则时分变更，则仅更新时间，重新排序
          bill.date = update.date
          group.items.sort((a, b) => dayjs(a.date).isBefore(dayjs(b.date)) ? 1 : -1)
        }
      }

      // 情况2：金额变更
      const diffAmount = update.amount - bill.amount
      group.expend += bill.type === 0 ? diffAmount : 0
      group.income += bill.type === 1 ? diffAmount : 0

      // 更新账单数据
      bill.type = update.type
      bill.ledger = update.ledger
      bill.category = update.category
      bill.account = update.account
      bill.amount = update.amount
      bill.remark = update.remark || ''
      bill.location = update.location || ''
      bill.address = update.address || ''
      bill.tags = update.tags || []
    }

    const deleteBill = async (billId: string) => {
      await fetchDeleteBill(billId)

      // 获取本地账单
      const local = getLoaclBill(billId)
      // 本地没数据，则不需要处理
      if (!local) {
        return
      }
      deleteLocalBill(local)
    }

    return {
      ...toRefs(state),
      loadBills,
      loadSummary,
      loadCharts,
      loadYearSummary,
      createBill,
      updateBill,
      deleteBill,
    }
  },
)
