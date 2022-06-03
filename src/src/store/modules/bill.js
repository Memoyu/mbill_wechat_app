
import api from "@/api/api"
import datetime from "@/common/utils/datetime";
import {
    INDEX_BILL_STAT,
    PROFILE_BILL_STAT,
    INDEX_BILL_TAGS,
    INDEX_CUR_MONTH,
    ADD_INDEX_BILL,
    ADD_INDEX_BILLS,
    MODIFY_INDEX_BILL,
    DEL_INDEX_BILL,
} from "../type"

const state = {
    indexCurMonth: {
        year: 0,
        month: 0,
    },
    indexStat: {
        expend: 0,
        income: 0
    },
    indexTags: [],
    indexBills: [],

    profileStat: {
        expend: 0,
        expendFormat: "0",
        income: 0,
        incomeFormat: "0",
        preOrder: 0,
        preOrderFormat: "0",
    },
}

const getters = {
    indexStat: state => state.indexStat,
    indexTags: state => state.indexTags,
    indexBills: state => state.indexBills,

    profileStat: state => state.profileStat,
}

const mutations = {
    [INDEX_BILL_STAT]: (state, stat) => {
        state.indexStat = stat;
    },
    [INDEX_BILL_TAGS]: (state, tags) => {
        state.indexTags = tags;
    },
    [INDEX_CUR_MONTH]: (state, date) => {
        let year = datetime.getCurYear(new Date(date));
        let month = datetime.getCurMonth(new Date(date));
        state.indexCurMonth = { year, month };
        // console.log("store curdate", state.indexCurMonth);
    },
    [ADD_INDEX_BILL]: (state, { bill, date }) => {
        // console.log("store mut", bill);
        let year = datetime.getCurYear(new Date(date));
        let month = datetime.getCurMonth(new Date(date));
        let day = datetime.getCurDay(new Date(date));
        // console.log("store mut", year, month, day, state.indexCurMonth);
        if (year == state.indexCurMonth.year && month === state.indexCurMonth.month) {

            //1、 处理统计数据
            if (bill.type == 0) {
                state.indexStat.expend = calcTotalStat(state.indexStat.expend, bill.amount, 0)
                state.profileStat.expend = calcTotalStat(state.profileStat.expend, bill.amount, 0)
            } else {
                state.indexStat.income = calcTotalStat(state.indexStat.income, bill.amount, 0)
                state.profileStat.income = calcTotalStat(state.profileStat.income, bill.amount, 0)
            }
            // 顺便加个格式化的金额
            bill.amountFormat = calcTotalStat("0", bill.amount, 0);

            //2、 处理标识数据
            let hasTag = true;
            try {
                state.indexTags.forEach((t) => {
                    if (year === t.year && month === t.month && day === t.day) {
                        t.total += 1
                        throw new Error("Ok"); // 跳出循环
                    } else {
                        hasTag = false;
                    }
                })
            } catch (e) {
                hasTag = true;
            };
            if (!hasTag) state.indexTags.push({ year, month, day, total: 1 })

            //3、 处理子项插入
            let hasGroup = true;
            try {
                if (state.indexBills.length > 0) {
                    state.indexBills.forEach((g) => {
                        if (day === g.day) { // 如果存在这一天的分组
                            g.items.push(bill);
                            g.items = g.items.sort((d1, d2) => {
                                return new Date(`2000-09-25 ${d1.time}`) < new Date(`2000-09-25 ${d2.time}`) ? 1 : -1
                            });
                            throw new Error("Ok"); // 跳出循环
                        } else { // 否则构造分组
                            hasGroup = false;
                        }
                    })
                } else {
                    hasGroup = false;
                }
            } catch (e) {
                hasGroup = true;
            };
            // 构造分组
            if (!hasGroup) {
                // 插入分组并排序
                state.indexBills.push({
                    day: day,
                    week: datetime.getCurWeek(new Date(date)),
                    items: [bill]
                })
                // console.log("store mut", state.indexBills);
                state.indexBills = state.indexBills.sort((b1, b2) => {
                    return b1.day < b2.day ? 1 : -1
                });
            }
        }
    },
    [ADD_INDEX_BILLS]: (state, { bills, isCover }) => {
        // 是否直接覆盖
        if (isCover) state.indexBills = bills;
        else {
            // console.log("store bills", bills);
            state.indexBills.forEach((g) => {
                for (var i = 0; i < bills.length; i++) {
                    // 如果已存在该天的记录
                    if (bills[i].day === g.day) {
                        // 移除已经存在的节点
                        for (var j = 0; j < g.items.length; j++) {
                            bills[i].items.splice(g.items.findIndex(item => item.id === g.items[j]), 1)
                        }

                        // 合并集合
                        g.items = g.items.concat(bills[i].items);
                        g.items = g.items.sort((d1, d2) => {
                            return new Date(`2000-09-25 ${d1.time}`) < new Date(`2000-09-25 ${d2.time}`) ? 1 : -1
                        });

                        // 移除该天的集合
                        bills.splice(i, 1);
                    }
                }
            });

            // 剩余集合并入并排序
            state.indexBills = state.indexBills.concat(bills);
            state.indexBills = state.indexBills.sort((b1, b2) => {
                return b1.day < b2.day ? 1 : -1
            });
        }
    },
    [DEL_INDEX_BILL]: (state, id) => {
        try {
            // console.log("store mut del", id);
            for (var b = 0; b < state.indexBills.length; b++) {

                // 获取元素下标
                let index = state.indexBills[b].items.findIndex(item => item.id == id);
                if (index !== -1) {
                    // 1、删除指定元素
                    // console.log("store mut del", index, res, state.indexBills[b].items);
                    // 提前获取day，可能会删除分组，删了day就没了
                    let day = state.indexBills[b].day;
                    let res = state.indexBills[b].items.splice(index, 1);
                    let bill = res[0];

                    // 如果分组删除后无元素，则删除分组
                    if (state.indexBills[b].items.length <= 0)
                        state.indexBills.splice(b, 1);

                    // 2、计算统计数据
                    // console.log("src ", bill);
                    if (bill.type == 0) {
                        state.indexStat.expend = calcTotalStat(state.indexStat.expend, bill.amount, 1)
                        state.profileStat.expend = calcTotalStat(state.profileStat.expend, bill.amount, 1)
                    } else {
                        state.indexStat.income = calcTotalStat(state.indexStat.income, bill.amount, 1)
                        state.profileStat.income = calcTotalStat(state.profileStat.income, bill.amount, 1)
                    }

                    //  3、处理标识
                    let year = state.indexCurMonth.year;
                    let month = state.indexCurMonth.month;
                    // console.log("store mut tag after", year, month, day, state.indexTags[i]);
                    try {
                        for (var i = 0; i < state.indexTags.length; i++) {
                            if (year === state.indexTags[i].year &&
                                month === state.indexTags[i].month &&
                                day === state.indexTags[i].day) {
                                // 如果总量小于等于0，则移除分组
                                // console.log("store mut tag", state.indexTags[i]);
                                state.indexTags[i].total -= 1
                                // console.log("store mut tag last", state.indexTags[i]);
                                if (state.indexTags[i].total <= 0)
                                    state.indexTags.splice(i, 1);
                                throw new Error("Ok"); // 跳出循环
                            }
                        }
                    } catch (e) {
                    };
                    throw new Error("Ok"); // 跳出循环
                }
            }
        } catch (e) {
        };
    },
    [PROFILE_BILL_STAT]: (state, stat) => {
        state.profileStat = stat;
    },
}

const actions = {

    //#region  首页

    // 获取首页指定月份账单总金额
    getIndexTotalStat({ commit }, params) {
        // console.log("Total", params);
        api.monthTotalStat({
            month: datetime.getCurDate(new Date(params)),
        }).then((res) => {
            if (res.data.code === 0) {
                commit(INDEX_BILL_STAT, res.data.result)
            }
        });
    },

    // 获取首页指定月份范围内的账单日期
    getIndexBillTags({ commit }, params) {
        // 会涉及跨年，需要处理
        let date = new Date(params);
        let prev = datetime.getPrevMonth(date);
        let next = datetime.getNextMonth(date);
        // console.log(prev, next);
        api.hasBillDays({
            beginDate: `${prev.year}-${prev.month}`,
            endDate: `${next.year}-${next.month}`,
        }).then((res) => {
            // console.log(res);
            if (res.data.code === 0) {
                commit(INDEX_BILL_TAGS, res.data.result)
            }
        });
    },

    // 获取首页账单分页数据，组装数据
    getIndexBills({ commit }, { date, page, isInit }) {
        return new Promise((resolve, reject) => {
            // console.log("init", isInit);
            if (isInit) commit(ADD_INDEX_BILLS, { bills: [], isCover: true })
            let month = datetime.getCurDate(new Date(date));
            commit(INDEX_CUR_MONTH, month)
            api.monthBills({
                month: month,
                ...page,
            }).then((res) => {
                if (res.data.code === 0) {
                    let total = res.data.result.total;
                    let items = res.data.result.items;
                    if (state.indexBills.length > 0) {
                        commit(ADD_INDEX_BILLS, { bills: items, isCover: false })
                    } else {

                        // this.groups = items;
                        commit(ADD_INDEX_BILLS, { bills: items, isCover: true })
                    }

                    resolve(total);
                }
            });
        });
    },

    // 修改首页账单项
    modifyIndexBill({ commit }, { bill, date }) {
        // console.log("store edit", bill);
        // 更改后会影响首页的字段：日期、时间、金额、账单类型
        let year = datetime.getCurYear(new Date(date));
        let month = datetime.getCurMonth(new Date(date));
        let day = datetime.getCurDay(new Date(date));
        // console.log("store mut", year, month, day, state.indexCurMonth);
        if (year == state.indexCurMonth.year && month === state.indexCurMonth.month) { // 年份、月份不变的情况下直接处理
            try {
                state.indexBills.forEach((g) => {
                    g.items.forEach((item, i) => {
                        // 找到元素
                        if (item.id === bill.id) {

                            g.items[i] = bill; // 覆盖源数据，此时item是不受影响的
                            // 如果时间不一致，排一下序就行
                            if (g.items[i].time != item.time) {
                                console.log("进行排序", g.items);
                                g.items = g.items.sort((d1, d2) => {
                                    return new Date(`2000-09-25 ${d1.time}`) < new Date(`2000-09-25 ${d2.time}`) ? 1 : -1
                                });
                            }

                            // 如果金额、账单类型不相等，进行统计调整
                            if (g.items[i].amount != item.amount || g.items[i].type != item.type) {
                                let op = item.amount < g.items[i].amount ? 0 : 1; // 源数据 小于 改后数据，则统计需要增加，否则减少
                                let diff = Math.abs(item.amount - g.items[i].amount);
                                // 确定当前账单类型，没改变类型则只需要更改对应类型的统计
                                if (g.items[i].type == item.type) {
                                    if (g.items[i].type == 0) { // 支出
                                        state.indexStat.expend = calcTotalStat(state.indexStat.expend, diff, op)
                                        state.profileStat.expend = calcTotalStat(state.profileStat.expend, diff, op)
                                    } else if (g.items[i].type == 1) { // 收入
                                        state.indexStat.income = calcTotalStat(state.indexStat.income, diff, op)
                                        state.profileStat.income = calcTotalStat(state.profileStat.income, diff, op)
                                    }
                                } else {
                                    if (g.items[i].type == 0) { // 收入 -> 支出
                                        // 支出直接加上改后的金额
                                        state.indexStat.expend = calcTotalStat(state.indexStat.expend, g.items[i].amount, 0)
                                        state.profileStat.expend = calcTotalStat(state.profileStat.expend, g.items[i].amount, 0)
                                        // 收入直接减去原本的金额
                                        state.indexStat.income = calcTotalStat(state.indexStat.income, item.amount, 1)
                                        state.profileStat.income = calcTotalStat(state.profileStat.income, item.amount, 1)
                                    } else if (g.items[i].type == 1) { // 支出 -> 收入
                                        // 支出直接减去原本的金额
                                        state.indexStat.expend = calcTotalStat(state.indexStat.expend, item.amount, 1)
                                        state.profileStat.expend = calcTotalStat(state.profileStat.expend, item.amount, 1)
                                        // 收入直接加上改后的金额
                                        state.indexStat.income = calcTotalStat(state.indexStat.income, g.items[i].amount, 0)
                                        state.profileStat.income = calcTotalStat(state.profileStat.income, g.items[i], 0)

                                    }
                                }
                            }


                            // 如果更改日期（具体几号），先移除，在添加  (整体操作必须在最后做)
                            if (day != g.day) {
                                commit(DEL_INDEX_BILL, bill.id);
                                commit(ADD_INDEX_BILL, { bill, date });
                            }


                            throw new Error("Ok"); // 跳出循环
                        }
                    });
                });
            } catch (e) {
            };
        } else { // 变更年份、月份则需要删除
            commit(DEL_INDEX_BILL, bill.id);
        }
    },

    //#endregion

    //#region 个人页面

    // 获取首页指定月份账单总金额
    getProfileTotalStat({ commit }) {
        // console.log("Total", params);
        api.yearTotalStat({
            year: datetime.getCurYear(),
        }).then((res) => {
            if (res.data.code === 0) {
                commit(PROFILE_BILL_STAT, res.data.result)
            }
        });
    },

    //#endregion
}

//#region 公共处理

/*
 * 针对统计数据带千位符进行处理，返回相加后的数据 保留两位小数
 * 0 相加
 * 1 相减
 */
const calcTotalStat = (src, incr, op) => {
    let sum = 0;
    let f = Number(src.replace(/,/g, ''));
    let l = Number(incr)
    if (op === 0) {
        let t = f + l;
        sum = t.fixed(2);
    } else if (op === 1) {

        let t = f - l;
        // console.log("rrrr", f, l, t);
        sum = t.fixed(2);
    }
    // console.log(sum);
    return sum.toString().replace(/\B(?=(\d{3})+\b)/g, ',')
}

//#endregion

export default {
    state,
    mutations,
    actions,
    getters
}
