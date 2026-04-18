import { defineStore } from 'pinia'

// 初始化状态
const initState = {
  tags: [
    {
      tagId: 't1001',
      name: '餐饮美食',
      childs: [
        { tagId: 't100101', name: '早餐' },
        { tagId: 't100102', name: '午餐' },
        { tagId: 't100103', name: '晚餐' },
        { tagId: 't100104', name: '夜宵' },
        { tagId: 't100105', name: '零食饮料' },
        { tagId: 't100106', name: '水果' },
      ],
    },
    {
      tagId: 't1002',
      name: '交通出行',
      childs: [
        { tagId: 't100201', name: '公交地铁' },
        { tagId: 't100202', name: '打车租车' },
        { tagId: 't100203', name: '加油充电' },
        { tagId: 't100204', name: '停车过路' },
        { tagId: 't100205', name: '保养维修' },
      ],
    },
    {
      tagId: 't1003',
      name: '购物消费',
      childs: [
        { tagId: 't100301', name: '服装鞋帽' },
        { tagId: 't100302', name: '美妆护肤' },
        { tagId: 't100303', name: '数码电子' },
        { tagId: 't100304', name: '日用百货' },
        { tagId: 't100305', name: '图书文具' },
        { tagId: 't100306', name: '母婴用品' },
        { tagId: 't100307', name: '宠物用品' },
      ],
    },
    {
      tagId: 't1004',
      name: '居住物业',
      childs: [
        { tagId: 't100401', name: '房租房贷' },
        { tagId: 't100402', name: '水电燃气' },
        { tagId: 't100403', name: '物业宽带' },
        { tagId: 't100404', name: '家居家装' },
        { tagId: 't100405', name: '维修保洁' },
      ],
    },
    {
      tagId: 't1005',
      name: '休闲娱乐',
      childs: [
        { tagId: 't100501', name: '电影演出' },
        { tagId: 't100502', name: '旅游度假' },
        { tagId: 't100503', name: '运动健身' },
        { tagId: 't100504', name: '游戏充值' },
        { tagId: 't100505', name: '聚会社交' },
      ],
    },
    {
      tagId: 't1006',
      name: '医疗健康',
      childs: [
        { tagId: 't100601', name: '挂号诊疗' },
        { tagId: 't100602', name: '药品器械' },
        { tagId: 't100603', name: '体检疫苗' },
        { tagId: 't100604', name: '牙齿眼科' },
        { tagId: 't100605', name: '心理咨询' },
      ],
    },
    {
      tagId: 't1007',
      name: '学习教育',
      childs: [
        { tagId: 't100701', name: '学费培训' },
        { tagId: 't100702', name: '考试考证' },
        { tagId: 't100703', name: '在线课程' },
        { tagId: 't100704', name: '书籍资料' },
      ],
    },
    {
      tagId: 't1008',
      name: '人情往来',
      childs: [
        { tagId: 't100801', name: '红包礼金' },
        { tagId: 't100802', name: '请客送礼' },
        { tagId: 't100803', name: '孝顺长辈' },
        { tagId: 't100804', name: '亲友借还' },
      ],
    },
    {
      tagId: 't1009',
      name: '金融保险',
      childs: [
        { tagId: 't100901', name: '保险费用' },
        { tagId: 't100902', name: '投资理财' },
        { tagId: 't100903', name: '银行手续费' },
        { tagId: 't100904', name: '税费' },
      ],
    },
    {
      tagId: 't1010',
      name: '其他支出',
      childs: [
        { tagId: 't101001', name: '慈善捐赠' },
        { tagId: 't101002', name: '罚款赔偿' },
        { tagId: 't101003', name: '意外损失' },
        { tagId: 't101004', name: '其他杂项' },
      ],
    },
  ],
}

export const useTagStore = defineStore(
  'tag',
  () => {
    const state = reactive({ ...initState })

    return {
      ...toRefs(state),
    }
  },
)
