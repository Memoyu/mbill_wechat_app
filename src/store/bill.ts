import type { IBill, IBillDateGroup, ICreateBill, IUpdateBill } from '@/api/types/bill'
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

    const loadIndexBills = async () => {
      state.bills = await getBillDateGroup()
    }

    const createBill = async (create: IBill, location?: string) => {
      // 维护本地bills
      await fetchCreateBill({
        ...create,
        ledgerId: create.ledger.ledgerId,
        categoryId: create.category.categoryId,
        accountId: create.account.accountId,
        tagIds: create.tags.map(tag => tag.tagId),
        location,
      })
    }

    const updateBill = async (update: IBill) => {
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
