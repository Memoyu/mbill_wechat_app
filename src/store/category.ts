import { defineStore } from 'pinia'

// 初始化状态
const initState = {
  categories: [{
    categoryId: 'a1231',
    name: '食品餐饮',
    icon: '',
    childs: [
      {
        categoryId: '12311',
        name: '早餐',
        icon: 'https://wot-ui.cn/assets/panda.jpg',
      },
      {
        categoryId: '12312',
        name: '午餐',
        icon: 'https://wot-ui.cn/assets/panda.jpg',
      },
      {
        categoryId: '12313',
        name: '晚餐',
        icon: 'https://wot-ui.cn/assets/panda.jpg',
      },
      {
        categoryId: '12314',
        name: '饮料酒水',
        icon: 'https://wot-ui.cn/assets/panda.jpg',
      },
      {
        categoryId: '12315',
        name: '零食',
        icon: 'https://wot-ui.cn/assets/panda.jpg',
      },
      {
        categoryId: '12316',
        name: '生鲜食品',
        icon: 'https://wot-ui.cn/assets/panda.jpg',
      },
      {
        categoryId: '12317',
        name: '请客吃饭',
        icon: 'https://wot-ui.cn/assets/panda.jpg',
      },
    ],
    createTime: '2024-06-02 12:09:00',
  }, {
    categoryId: 'b1232',
    name: '购物消费',
    icon: '',
    childs: [
      {
        categoryId: '12321',
        name: '日常家居',
        icon: 'https://wot-ui.cn/assets/panda.jpg',
      },
      {
        categoryId: '12322',
        name: '个人美妆',
        icon: 'https://wot-ui.cn/assets/panda.jpg',
      },
      {
        categoryId: '12323',
        name: '手机数码',
        icon: 'https://wot-ui.cn/assets/panda.jpg',
      },
      {
        categoryId: '12324',
        name: '虚拟充值',
        icon: 'https://wot-ui.cn/assets/panda.jpg',
      },
      {
        categoryId: '12325',
        name: '生活电器',
        icon: 'https://wot-ui.cn/assets/panda.jpg',
      },
      {
        categoryId: '12326',
        name: '配饰腕表',
        icon: 'https://wot-ui.cn/assets/panda.jpg',
      },
      {
        categoryId: '12327',
        name: '母婴玩具',
        icon: 'https://wot-ui.cn/assets/panda.jpg',
      },
      {
        categoryId: '12328',
        name: '测试分类',
        icon: 'https://wot-ui.cn/assets/panda.jpg',
      },
      {
        categoryId: '123212',
        name: '日常家居2',
        icon: 'https://wot-ui.cn/assets/panda.jpg',
      },
      {
        categoryId: '123222',
        name: '个人美妆2',
        icon: 'https://wot-ui.cn/assets/panda.jpg',
      },
      {
        categoryId: '123232',
        name: '手机数码2',
        icon: 'https://wot-ui.cn/assets/panda.jpg',
      },
      {
        categoryId: '123242',
        name: '虚拟充值2',
        icon: 'https://wot-ui.cn/assets/panda.jpg',
      },
      {
        categoryId: '123252',
        name: '生活电器2',
        icon: 'https://wot-ui.cn/assets/panda.jpg',
      },
      {
        categoryId: '123262',
        name: '配饰腕表2',
        icon: 'https://wot-ui.cn/assets/panda.jpg',
      },
      {
        categoryId: '123272',
        name: '母婴玩具2',
        icon: 'https://wot-ui.cn/assets/panda.jpg',
      },
      {
        categoryId: '123282',
        name: '测试分类2',
        icon: 'https://wot-ui.cn/assets/panda.jpg',
      },
    ],
    createTime: '2024-06-02 12:59:00',
  }, {
    categoryId: 'c1233',
    name: '出行交通',
    icon: '',
    childs: [

    ],
    createTime: '2024-06-02 12:49:00',
  }, {
    categoryId: 'd1234',
    name: '休闲娱乐',
    icon: '',
    childs: [

    ],
    createTime: '2024-06-02 12:39:00',
  }, {
    categoryId: 'e1235',
    name: '健康医疗',
    icon: '',
    childs: [

    ],
    createTime: '2024-06-02 12:29:00',
  }, {
    categoryId: 'f1236',
    name: '居家生活',
    icon: '',
    childs: [

    ],
    createTime: '2024-06-02 12:19:00',
  }, {
    categoryId: 'g1237',
    name: '文化教育',
    icon: '',
    childs: [

    ],
    createTime: '2024-06-02 12:09:32',
  }, {
    categoryId: 'h1238',
    name: '送礼人情',
    icon: '',
    childs: [
      {
        categoryId: 'h12381',
        name: '早餐1',
        icon: 'https://wot-ui.cn/assets/panda.jpg',
      },
      {
        categoryId: 'h12382',
        name: '午餐2',
        icon: 'https://wot-ui.cn/assets/panda.jpg',
      },
      {
        categoryId: 'h12383',
        name: '晚餐3',
        icon: 'https://wot-ui.cn/assets/panda.jpg',
      },
      {
        categoryId: 'h12384',
        name: '饮料酒水4',
        icon: 'https://wot-ui.cn/assets/panda.jpg',
      },
      {
        categoryId: 'h12385',
        name: '零食5',
        icon: 'https://wot-ui.cn/assets/panda.jpg',
      },
      {
        categoryId: 'h12386',
        name: '生鲜食品6',
        icon: 'https://wot-ui.cn/assets/panda.jpg',
      },
      {
        categoryId: 'h12387',
        name: '请客吃饭7',
        icon: 'https://wot-ui.cn/assets/panda.jpg',
      },
    ],
    createTime: '2024-06-02 12:09:30',
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
