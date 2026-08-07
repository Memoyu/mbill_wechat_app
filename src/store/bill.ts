import type { IBill, IBillDateGroup, IBillPageQuery, IEditBill } from '@/api/types/bill'
import dayjs from 'dayjs'
import lodash from 'lodash'
import { defineStore } from 'pinia'
import {
  createBill as fetchCreateBill,
  deleteBill as fetchDeleteBill,
  updateBill as fetchUpdateBill,
  getBillDateGroup,
} from '@/api/bill'

// 初始化状态
const initState: {
  bills: IBillDateGroup[]
} = {
  bills: [],
}

export const useBillStore = defineStore(
  'bill',
  () => {
    const state = reactive({ ...initState })

    const loadIndexBills = async (query: IBillPageQuery) => {
      const res = await getBillDateGroup(query)
      state.bills = res.items
    }

    // 辅助函数：将账单插入到分组中的正确位置以保持时间排序
    const insertBillIntoSortedGroup = (group: IBillDateGroup, bill: any) => {
      const timeToCompare = dayjs(bill.date).valueOf()
      let insertIndex = group.items.length

      // 从后往前查找插入位置（假设通常是最新时间）
      for (let i = group.items.length - 1; i >= 0; i--) {
        if (dayjs(group.items[i].date).valueOf() <= timeToCompare) {
          insertIndex = i + 1
          break
        }
        insertIndex = i
      }

      group.items.splice(insertIndex, 0, bill)
    }

    // 辅助函数：将分组插入到正确位置以保持日期排序
    const insertGroupIntoSortedGroups = (groups: IBillDateGroup[], newGroup: IBillDateGroup) => {
      const dateToCompare = dayjs(newGroup.date).valueOf()
      let insertIndex = groups.length

      // 从后往前查找插入位置（假设通常是最新日期）
      for (let i = groups.length - 1; i >= 0; i--) {
        if (dayjs(groups[i].date).valueOf() <= dateToCompare) {
          insertIndex = i + 1
          break
        }
        insertIndex = i
      }

      groups.splice(insertIndex, 0, newGroup)
    }

    const createBill = async (create: IEditBill, location?: string) => {
      const billId = await fetchCreateBill({
        ...create,
        ledgerId: create.ledger.ledgerId,
        categoryId: create.category.categoryId,
        accountId: create.account.accountId,
        tagIds: (create.tags || []).map(tag => tag.tagId),
        location,
      })

      // 维护本地bills数据
      // state.bills.forEach((b) => {
      //   // 是否已存在这天的分组
      //   if (dayjs(b.date).isSame(dayjs(bill.date), 'day')) {
      //     b.items.push(bill)
      //   }
      // })
      const bill: IBill = {
        ...create,
        billId,
        refundAmount: 0,
        remark: create.remark || '',
        address: create.address || '',
        tags: create.tags || [],
        createTime: new Date(),
      }
      bill.billId = billId
      // 维护本地bills数据
      const targetDate = dayjs(bill.date).format('YYYY-MM-DD')

      // 查找是否已存在这天的分组
      const existingGroup = state.bills.find(b => dayjs(b.date).format('YYYY-MM-DD') === targetDate)

      if (existingGroup) {
        // 如果存在该日期分组，将账单插入到正确位置以保持排序
        insertBillIntoSortedGroup(existingGroup, bill)
      }
      else {
        // 如果不存在该日期分组，创建新的分组
        const newGroup: IBillDateGroup = {
          date: bill.date,
          items: [bill],
          income: bill.type === 0 ? bill.amount : 0,
          expend: bill.type === 1 ? bill.amount : 0,
        }

        // 将新分组插入到正确位置以保持日期排序
        insertGroupIntoSortedGroups(state.bills, newGroup)
      }
    }

    const updateBill = async (update: IEditBill) => {
      // 更新数据

    }

    const deleteBill = (billId: string) => {

    }

    return {
      ...toRefs(state),
      loadIndexBills,
      createBill,
      updateBill,
      deleteBill,
    }
  },
)
