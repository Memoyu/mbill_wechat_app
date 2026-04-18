import { defineStore } from 'pinia'

// 初始化状态
const initState = {
  accounts: [{
    accountId: '1231',
    name: '资金账户',
    icon: '',
    childs: [
      {
        accountId: '12311',
        name: '现金',
        icon: '',
      },
      {
        accountId: '12312',
        name: '支付宝',
        icon: '',
      },
      {
        accountId: '12313',
        name: '微信钱包',
        icon: '',
      },
      {
        accountId: '12314',
        name: '银行卡',
        icon: '',
      },
      {
        accountId: '12315',
        name: 'QQ钱包',
        icon: '',
      },
      {
        accountId: '12316',
        name: '京东金融',
        icon: '',
      },
      {
        accountId: '12317',
        name: '其他',
        icon: '',
      },
    ],
    createTime: '2024-06-02 12:09:00',
  }, {
    accountId: '1232',
    name: '信贷账户',
    icon: '',
    childs: [
      {
        accountId: '12321',
        name: '信用卡',
        icon: '',
      },
      {
        accountId: '12322',
        name: '花呗',
        icon: '',
      },
      {
        accountId: '12323',
        name: '白条',
        icon: '',
      },
      {
        accountId: '12324',
        name: '其他',
        icon: '',
      },

    ],
    createTime: '2024-06-02 12:09:20',
  }, {
    accountId: '1233',
    name: '充值账户',
    icon: '',
    childs: [
      {
        accountId: '12331',
        name: '会员卡',
        icon: '',
      },
      {
        accountId: '12332',
        name: '公交卡',
        icon: '',
      },
      {
        accountId: '12333',
        name: '饭卡',
        icon: '',
      },
      {
        accountId: '12334',
        name: '押金',
        icon: '',
      },
      {
        accountId: '12335',
        name: '其他',
        icon: '',
      },
    ],
    createTime: '2024-06-02 12:09:40',
  }, {
    accountId: '1234',
    name: '投资理财',
    icon: '',
    childs: [
      {
        accountId: '12341',
        name: '保险',
        icon: '',
      },
      {
        accountId: '12342',
        name: '虚拟货币',
        icon: '',
      },
      {
        accountId: '12343',
        name: '其他',
        icon: '',
      },
    ],
    createTime: '2024-06-02 12:09:30',
  }, {
    accountId: '1235',
    name: '二手货物',
    icon: '',
    childs: [
      {
        accountId: '12351',
        name: '房子',
        icon: '',
      },
      {
        accountId: '12352',
        name: '车子',
        icon: '',
      },
      {
        accountId: '12353',
        name: '其他',
        icon: '',
      },

    ],
    createTime: '2024-06-02 12:09:50',
  }],
}

export const useAccountStore = defineStore(
  'account',
  () => {
    const state = reactive({ ...initState })

    return {
      ...toRefs(state),
    }
  },
)
