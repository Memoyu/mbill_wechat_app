
import api from "@/api/api"
import datetime from "@/common/utils/datetime";
import {
    GROUP_INDEX_ADD_GROUP,
    GROUP_INDEX_ADD_GROUPS,
    GROUP_INDEX_EDIT_GROUP,
    GROUP_INDEX_DEL_GROUP,
    GROUP_INDEX_MODIFY_PRE_ORDER_AMOUNT,
    GROUP_INDEX_MODIFY_PRE_ORDER_STATUS,
    GROUP_INDEX_ADD_PRE_ORDER,
    GROUP_INDEX_DEL_PRE_ORDER,
    GROUP_INDEX_STAT
} from "../type"

const state = {
    IndexStat: {
        total: 0,
        amount: 0,
        done: 0,
        undone: 0,
    },
    IndexGroups: [],

}

const getters = {
    IndexGroups: state => state.IndexGroups,
}

const mutations = {
    [GROUP_INDEX_ADD_GROUP]: (state, group) => {
        state.IndexGroups.unshift(group);
        // 调整统计数
        state.IndexStat.total += 1;
    },

    [GROUP_INDEX_ADD_GROUPS]: (state, { groups, isCover }) => {
        // 是否直接覆盖
        if (isCover) state.IndexGroups = groups;
        else {
            // console.log("store groups", groups);
            // 剩余集合并入并排序
            state.IndexGroups = state.IndexGroups.concat(groups);
            // state.IndexGroups = state.IndexGroups.sort((g1, g2) => {
            //     return new Date(g1.createTime) < new Date(g2.createTime) ? 1 : -1
            // });
        }
    },

    [GROUP_INDEX_EDIT_GROUP]: (state, group) => {
        try {
            for (let i = 0; i < state.IndexGroups.length; i++) {
                if (group.id == state.IndexGroups[i].id) {
                    state.IndexGroups[i] = group;
                    throw new Error("Ok"); // 跳出循环
                }
            }
        } catch (e) { }
    },

    [GROUP_INDEX_DEL_GROUP]: (state, group) => {
        try {
            for (let i = 0; i < state.IndexGroups.length; i++) {
                if (group.id == state.IndexGroups[i].id) {
                    // 减少预购清单页面统计数据
                    state.IndexStat.total -= 1;
                    state.IndexStat.amount -= group.amount;
                    state.IndexStat.done -= group.done;
                    state.IndexStat.unDone -= group.unDone;

                    // 删除数据
                    this.orders.splice(i, 1);
                    throw new Error("Ok"); // 跳出循环
                }
            }
        } catch (e) { }
    },

    [GROUP_INDEX_MODIFY_PRE_ORDER_AMOUNT]: (state, { groupId, amount, op }) => {
        console.log("amount, op", amount, op);
        try {
            for (let i = 0; i < state.IndexGroups.length; i++) {
                if (groupId == state.IndexGroups[i].id) {
                    let a = state.IndexGroups[i].amount;
                    if (op === 0) {
                        state.IndexGroups[i].amount = (a + amount).fixed(2);
                    } else if (op === 1) {
                        state.IndexGroups[i].amount = (a - amount).fixed(2);
                    }
                    throw new Error("Ok"); // 跳出循环
                }
            }
        } catch (e) { }
        let s = state.IndexStat.amount;
        if (op === 0) {
            state.IndexStat.amount = (s + amount).fixed(2);
        } else if (op === 1) {
            state.IndexStat.amount = (s - amount).fixed(2);
        }
    },

    [GROUP_INDEX_MODIFY_PRE_ORDER_STATUS]: (state, order) => {// 仅限于修改完成状态使用
        try {
            for (let i = 0; i < state.IndexGroups.length; i++) {
                if (order.groupId == state.IndexGroups[i].id) { // 修改该分组完成状态数量
                    // console.log("开始了", order);
                    if (order.status == 0) {
                        // 增加未完成
                        state.IndexGroups[i].unDone += 1;
                        // 减少已完成
                        state.IndexGroups[i].done -= 1;
                    } else {
                        state.IndexGroups[i].done += 1;
                        state.IndexGroups[i].unDone -= 1;
                    }
                    throw new Error("Ok"); // 跳出循环
                }
            }
        } catch (e) { }

        if (order.status == 0) {
            // 增加未完成
            state.IndexStat.unDone += 1;
            // 减少已完成
            state.IndexStat.done -= 1;
        } else {
            state.IndexStat.done += 1;
            state.IndexStat.unDone -= 1;
        }
    },

    [GROUP_INDEX_ADD_PRE_ORDER]: (state, order) => {
        try {
            for (let i = 0; i < state.IndexGroups.length; i++) {
                if (order.groupId == state.IndexGroups[i].id) { // 修改该分组完成状态数量
                    // 增加未完成
                    state.IndexGroups[i].unDone += 1;
                    throw new Error("Ok"); // 跳出循环
                }
            }
        } catch (e) { }
        state.IndexStat.unDone += 1;
    },


    [GROUP_INDEX_DEL_PRE_ORDER]: (state, order) => {
        try {
            for (let i = 0; i < state.IndexGroups.length; i++) {
                if (order.groupId == state.IndexGroups[i].id) { // 修改该分组完成状态数量
                    if (order.status == 0) {
                        state.IndexGroups[i].unDone -= 1;
                    } else {
                        state.IndexGroups[i].done -= 1;
                    }
                    throw new Error("Ok"); // 跳出循环
                }
            }
        } catch (e) { }

        if (order.status == 0) {
            state.IndexStat.unDone -= 1;
        } else {
            state.IndexStat.done -= 1;
        }
    },

    [GROUP_INDEX_STAT]: (state, stat) => {
        state.IndexStat = stat;
    },
}

const actions = {
    // 获取首页账单分页数据，组装数据
    getPreOrderGroups({ commit }, { date, page, isInit }) {
        return new Promise((resolve, reject) => {
            // console.log("init", isInit);
            if (isInit) commit(GROUP_INDEX_ADD_GROUPS, { groups: [], isCover: true })
            let month = datetime.getCurDate(new Date(date));
            api.monthPreOrderGroups({
                month,
                ...page,
            }).then((res) => {
                if (res.data.code === 0) {
                    let total = res.data.result.total;
                    let items = res.data.result.items;
                    console.log(state);
                    if (state.IndexGroups.length > 0) {
                        commit(GROUP_INDEX_ADD_GROUPS, { groups: items, isCover: false })
                    } else {
                        // console.log(res.data.result);
                        // this.groups = items;
                        commit(GROUP_INDEX_ADD_GROUPS, { groups: items, isCover: true })
                    }

                    resolve(total);
                }
            });
        });
    },

    // 获取预购清单首页统计
    getIndexPreOrderStats({ commit }, date) {
        return new Promise((resolve, reject) => {
            let month = datetime.getCurDate(new Date(date));
            api.indexPreOrderStat({
                month,
            }).then((res) => {
                if (res.data.code === 0) {
                    let stat = res.data.result;
                    commit(GROUP_INDEX_STAT, stat)
                    resolve(res);
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
