//#region User

//是否登录
export const IS_LOGIN = 'IS_LOGIN'
//设置token
export const SET_TOKEN = 'SET_TOKEN'
//设置用户信息
export const SET_USER = 'SET_USER'

//#endregion

//#region Bill

// 初始vuex中的bill数据
export const INIT_BILL = 'INIT_BILL'

//首页账单统计
export const INDEX_BILL_STAT = 'INDEX_BILL_STAT'
//首页账单日期标识
export const INDEX_BILL_TAGS = 'INDEX_BILL_TAGS'
//首页当前日期
export const INDEX_CUR_MONTH = 'INDEX_CUR_MONTH'
//添加首页账单
export const ADD_INDEX_BILL = 'ADD_INDEX_BILL'
//添加首页账单集合
export const ADD_INDEX_BILLS = 'ADD_INDEX_BILLS'
//更改首页账单
export const MODIFY_INDEX_BILL = 'MODIFY_INDEX_BILL'
//删除首页账单
export const DEL_INDEX_BILL = 'DEL_INDEX_BILL'

//#endregion

//#region 个人页面

// 个人页面统计
export const PROFILE_BILL_STAT = 'PROFILE_BILL_STAT'

// 个人页面统计 预购金额
export const PROFILE_BILL_STAT_PRE_ORDER_AMOUNT = 'PROFILE_BILL_STAT_PRE_ORDER_AMOUNT'

//#endregion

//#region 预购清单

// 新增预购清单首页分组
export const GROUP_INDEX_ADD_GROUP = 'GROUP_INDEX_ADD_GROUP'

// 新增预购清单首页分组集合
export const GROUP_INDEX_ADD_GROUPS = 'GROUP_INDEX_ADD_GROUPS'

// 编辑预购清单首页分组
export const GROUP_INDEX_EDIT_GROUP = 'GROUP_INDEX_EDIT_GROUP'

// 删除预购清单首页分组
export const GROUP_INDEX_DEL_GROUP = 'GROUP_INDEX_DEL_GROUP'

// 新增预购
export const GROUP_INDEX_ADD_PRE_ORDER = 'GROUP_INDEX_ADD_PRE_ORDER'

// 删除预购
export const GROUP_INDEX_DEL_PRE_ORDER = 'GROUP_INDEX_DEL_PRE_ORDER'

// 变更 预购金额 -> 预购清单首页金额
export const GROUP_INDEX_MODIFY_PRE_ORDER_AMOUNT = 'GROUP_INDEX_MODIFY_PRE_ORDER_AMOUNT'

// 变更 预购状态 -> 预购清单首页完成、未完成数
export const GROUP_INDEX_MODIFY_PRE_ORDER_STATUS = 'GROUP_INDEX_MODIFY_PRE_ORDER_STATUS'


// 预购清单首页统计
export const GROUP_INDEX_STAT = 'GROUP_INDEX_STAT'

//#endregion