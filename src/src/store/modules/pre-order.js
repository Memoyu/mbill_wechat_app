
import api from "@/api/api"
import datetime from "@/common/utils/datetime";
import {
    ADD_PRE_ORDER_GROUPS
} from "../type"

const state = {
    preOrderGroups: [],
}

const getters = {
    preOrderGroups: state => state.preOrderGroups,
}

const mutations = {
    [ADD_PRE_ORDER_GROUPS]: (state, { groups, isCover }) => {
        // 是否直接覆盖
        if (isCover) state.preOrderGroups = groups;
        else {
            // console.log("store groups", groups);
            // 剩余集合并入并排序
            state.preOrderGroups = state.preOrderGroups.concat(groups);
            state.preOrderGroups = state.preOrderGroups.sort((b1, b2) => {
                return b1.day < b2.day ? 1 : -1
            });
        }
    },
}

const actions = {
    // 获取首页账单分页数据，组装数据
    getPreOrderGroups({ commit }, { date, page, isInit }) {
        return new Promise((resolve, reject) => {
            // console.log("init", isInit);
            if (isInit) commit(ADD_PRE_ORDER_GROUPS, { groups: [], isCover: true })
            let month = datetime.getCurDate(new Date(date));
            api.monthPreOrderGroups({
                month,
                ...page,
            }).then((res) => {
                if (res.data.code === 0) {
                    let total = res.data.result.total;
                    let items = res.data.result.items;
                    console.log(state);
                    if (state.preOrderGroups.length > 0) {
                        commit(ADD_PRE_ORDER_GROUPS, { groups: items, isCover: false })
                    } else {
                        console.log(res.data.result);
                        // this.groups = items;
                        commit(ADD_PRE_ORDER_GROUPS, { groups: items, isCover: true })
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
