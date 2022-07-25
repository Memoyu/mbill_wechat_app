import { http } from './service.js'

const bill = {
    //#region   账单信息

    // 新增账单详情
    addBill(params) {
        return http.post('bill', params)
    },

    // 删除账单详情
    delBill(params) {
        return http.delete('bill', params)
    },

    // 获取账单详情
    editBill(params) {
        return http.put('bill', params)
    },

    // 获取账单详情
    billDetail(params) {
        return http.get('bill', { params: params })
    },

    // 获取指定月份账单总金额
    monthTotalStat(params) {
        return http.get('bill/stat/month-total', { params: params })
    },

    // 获取指定月份账单总金额
    yearTotalStat(params) {
        return http.get('bill/stat/year-total', { params: params })
    },

    // 获取日期范围内存在账单的日期
    hasBillDays(params) {
        return http.get('bill/date/has-bill-days', { params: params })
    },

    // 获取指定月份日分组分页账单
    monthBills(params) {
        return http.get('bill/month/pages', { params: params })
    },

    // 获取指定日期账单
    dayBills(params) {
        return http.get('bill/day', { params: params })
    },

    // 获取指定条件分页账单
    billPages(params) {
        return http.get('bill/pages', { params: params })
    },

    //#endregion

    //#region 账单统计

    // 年收支结余统计
    yearSurplus(params) {
        return http.get('bill/stat/year-surplus', { params: params })
    },

    // 月收支趋势统计
    monthTotalTrend(params) {
        return http.get('bill/stat/trend/month-total', { params: params })
    },

    // 年收支趋势统计
    yearTotalTrend(params) {
        return http.get('bill/stat/trend/year-total', { params: params })
    },

    // 收支分类占比统计
    categoryPercent(params) {
        return http.get('bill/stat/percent/category', { params: params })
    },

    // 收支分类占比分组列表
    categoryPercentGroup(params) {
        return http.get('bill/stat/percent/category/group', { params: params })
    },

    // 指定条件账单排行列表
    billRanking(params) {
        return http.get('bill/stat/ranking', { params: params })
    },

    //#endregion

    //#region 账单分类

    // 获取分组后的账单分类
    getCategoryGroups(params) {
        return http.get('category/groups', { params: params })
    },

    // 获取全部账单分类
    categoryList(params) {
        return http.get('category', { params: params })
    },

    // 排序账单分类
    sortCategoryGroups(params) {
        return http.post('category/sort', params)
    },

    // 创建账单分类分组
    createCategoryGroup(params) {
        return http.post('category', params)
    },

    // 编辑账单分类分组
    editCategoryGroup(params) {
        return http.put('category', params)
    },

    // 删除账单分类分组
    delCategoryGroup(params) {
        return http.delete('category', params)
    },

    // 创建账单分类
    createCategory(params) {
        return http.post('category', params)
    },

    // 编辑账单分类
    editCategory(params) {
        return http.put('category', params)
    },

    // 删除账单分类
    delCategory(params) {
        return http.delete('category', params)
    },



    //#endregion

    //#region 账单账户

    // 获取分组后的账单账户
    assetGroups(params) {
        return http.get('asset/groups', { params: params })
    },

    //#endregion
}

export default bill;