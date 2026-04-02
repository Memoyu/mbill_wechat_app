import { defineStore } from 'pinia'

// 初始化状态
const initState = {
  categories: [{
    categoryId: '1231',
    name: '食品餐饮',
    icon: '',
    childs: [
      {
        categoryId: '12311',
        name: '早餐',
        icon: '',
      },
      {
        categoryId: '12312',
        name: '午餐',
        icon: '',
      },
      {
        categoryId: '12313',
        name: '晚餐',
        icon: '',
      },
      {
        categoryId: '12314',
        name: '饮料酒水',
        icon: '',
      },
      {
        categoryId: '12315',
        name: '零食',
        icon: '',
      },
      {
        categoryId: '12316',
        name: '生鲜食品',
        icon: '',
      },
      {
        categoryId: '12317',
        name: '请客吃饭',
        icon: '',
      },
    ],
  }, {
    categoryId: '1232',
    name: '购物消费',
    icon: '',
    childs: [
      {
        categoryId: '12321',
        name: '日常家居',
        icon: '',
      },
      {
        categoryId: '12322',
        name: '个人美妆',
        icon: '',
      },
      {
        categoryId: '12323',
        name: '手机数码',
        icon: '',
      },
      {
        categoryId: '12324',
        name: '虚拟充值',
        icon: '',
      },
      {
        categoryId: '12325',
        name: '生活电器',
        icon: '',
      },
      {
        categoryId: '12326',
        name: '配饰腕表',
        icon: '',
      },
      {
        categoryId: '12327',
        name: '母婴玩具',
        icon: '',
      },
    ],
  }, {
    categoryId: '1233',
    name: '出行交通',
    icon: '',
    childs: [

    ],
  }, {
    categoryId: '1234',
    name: '休闲娱乐',
    icon: '',
    childs: [

    ],
  }, {
    categoryId: '1235',
    name: '健康医疗',
    icon: '',
    childs: [

    ],
  }, {
    categoryId: '1236',
    name: '居家生活',
    icon: '',
    childs: [

    ],
  }, {
    categoryId: '1237',
    name: '文化教育',
    icon: '',
    childs: [

    ],
  }, {
    categoryId: '1238',
    name: '送礼人情',
    icon: '',
    childs: [

    ],
  }],
}

export const useCategoryStore = defineStore(
  'category',
  () => {
    const state = reactive({ ...initState })

    return {
      ...toRefs(state),
    }
  },
)
