
import api from "@/api/api"
import datetime from "@/common/utils/datetime";
import {
    ADD_PRE_ORDER_INDEX_GROUP,
    ADD_PRE_ORDER_INDEX_GROUPS,
    EDIT_PRE_ORDER_INDEX_GROUP,
    PRE_ORDER_INDEX_STAT
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
    [ADD_PRE_ORDER_INDEX_GROUP]: (state, group) => {
        state.IndexGroups.unshift(group);
        // 调整统计数
        state.IndexStat.total += 1;
    },

    [ADD_PRE_ORDER_INDEX_GROUPS]: (state, { groups, isCover }) => {
        // 是否直接覆盖
        if (isCover) state.IndexGroups = groups;
        else {
            // console.log("store groups", groups);
            // 剩余集合并入并排序
            state.IndexGroups = state.IndexGroups.concat(groups);
            state.IndexGroups = state.IndexGroups.sort((g1, g2) => {
                return new Date(g1.createTime) < new Date(g2.createTime) ? 1 : -1
            });
        }
    },

    [EDIT_PRE_ORDER_INDEX_GROUP]: (state, group) => {
        try {
            for (let i = 0; i < state.IndexGroups.length; i++) {
                if (group.id == state.IndexGroups[i].id) {
                    state.IndexGroups[i] = group;
                    throw new Error("Ok"); // 跳出循环
                }
            }
        } catch (e) { }
    },

    [PRE_ORDER_INDEX_STAT]: (state, stat) => {
        state.IndexStat = stat;
    },
}

const actions = {
    // 获取首页账单分页数据，组装数据
    getPreOrderGroups({ commit }, { date, page, isInit }) {
        return new Promise((resolve, reject) => {
            // console.log("init", isInit);
            if (isInit) commit(ADD_PRE_ORDER_INDEX_GROUPS, { groups: [], isCover: true })
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
                        commit(ADD_PRE_ORDER_INDEX_GROUPS, { groups: items, isCover: false })
                    } else {
                        // console.log(res.data.result);
                        // this.groups = items;
                        commit(ADD_PRE_ORDER_INDEX_GROUPS, { groups: items, isCover: true })
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
                    commit(PRE_ORDER_INDEX_STAT, stat)
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
