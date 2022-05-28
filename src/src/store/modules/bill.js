
import api from "@/api/api"
import datetime from "@/common/utils/datetime";
import {
    INDEX_BILL_STAT,
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
}

const getters = {
    indexStat: state => state.indexStat,
    indexTags: state => state.indexTags,
    indexBills: state => state.indexBills,
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
        console.log("store curdate", state.indexCurMonth);
    },
    [ADD_INDEX_BILL]: (state, { bill, date }) => {
        // console.log("store mut", bill);
        let year = datetime.getCurYear(new Date(date));
        let month = datetime.getCurMonth(new Date(date));
        let day = datetime.getCurDay(new Date(date));
        // console.log("store mut", year, month, day, state.indexCurMonth);
        if (year == state.indexCurMonth.year && month === state.indexCurMonth.month) {

            // 处理统计数据
            if (bill.type == 0) {
                let sum = Number(state.indexStat.expend.replace(/,/g, '')) + Number(bill.amount);
                state.indexStat.expend = sum.toString().replace(/\B(?=(\d{3})+\b)/g, ',')
            } else {
                let sum = Number(state.indexStat.income.replace(/,/g, '')) + Number(bill.amount);
                state.indexStat.income = sum.toString().replace(/\B(?=(\d{3})+\b)/g, ',')
            }

            // 处理标识数据
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

            let hasGroup = true;
            try {
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
            } catch (e) {
                hasGroup = true;
            };
            // 构造分组
            if (!hasGroup) {
                let min = state.indexBills[state.indexBills.length - 1];
                // console.log("store mut", min);
                // 如果添加的分组大于当前最小时间，则需进行添加
                if (day > min.day) {
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
        }
    },
    [ADD_INDEX_BILLS]: (state, { bills, isCover }) => {
        if (isCover) state.indexBills = bills;
        else {
            // console.log("store bills", bills);
            state.indexBills.forEach((g) => {
                bills.forEach((bill, i) => {
                    if (bill.day === g.day) {
                        g.items = g.items.concat(bill.items);
                        bills.splice(i, 1);
                    }
                });
            });
            state.indexBills = state.indexBills.concat(bills);
        }
    },
    [MODIFY_INDEX_BILL]: (state, bill) => {

    },
    [DEL_INDEX_BILL]: (state, bill) => {

    }
}

const actions = {
    // 获取指定月份账单总金额
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

    // 获取指定月份范围内的账单日期
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

    // 获取账单分页数据，组装数据
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

}

export default {
    state,
    mutations,
    actions,
    getters
}
