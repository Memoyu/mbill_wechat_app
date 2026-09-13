import dayjs from 'dayjs'
import { defineStore } from 'pinia'

export interface IBillFilter {
  type?: number // 账单类型
  dateType?: string
  beginDate: string
  endDate: string
  ledgers: string[]
  ledgerNames: string
  categories: string[]
  categoryNames: string
  accounts: string[]
  accountNames: string
  tags: string[]
  tagNames: string
  amountMin?: number
  amountMax?: number
}

interface State {
  filter: IBillFilter
}

const initState: State = {
  filter: {
    dateType: '0',
    ledgers: [],
    ledgerNames: '',
    categories: [],
    categoryNames: '',
    accounts: [],
    accountNames: '',
    tags: [],
    tagNames: '',
    ...getDateRange('0'),
  },
}

function getDateRange(type?: string) {
  let beginDate = dayjs()
  const endDate = dayjs()
  if (type) {
    if (type === '0') {
      beginDate = dayjs().add(-7, 'day')
    }
    else if (type === '1') {
      beginDate = dayjs().add(-1, 'month')
    }
    else if (type === '2') {
      beginDate = dayjs().add(-3, 'month')
    }
    else if (type === '3') {
      beginDate = dayjs().add(-6, 'month')
    }
  }
  return { beginDate: dayjs(beginDate).format('YYYY-MM-DD'), endDate: dayjs(endDate).format('YYYY-MM-DD') }
}

// 配置
export const useFilterBillStore = defineStore(
  'filter-bill',
  () => {
    const state = reactive({ ...initState })

    const update = (f: IBillFilter) => {
      state.filter = f
    }

    const reset = () => {
      return { ...initState.filter, ...getDateRange(initState.filter.dateType) }
    }

    const dateRange = (type?: string) => getDateRange(type)

    return {
      ...toRefs(state),
      update,
      reset,
      dateRange,
    }
  },
)
