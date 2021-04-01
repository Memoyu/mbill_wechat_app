import store from '@/common/store'
import api from '@/common/request/index'
import Value from "@/common/utils/value";
import {
    ADD_STATEMENT,
    ADD_STATEMENTS,
    DEL_STATEMENT,
    COVER_STATEMENTS,
    MODIFY_STATEMENT,
    STATEMENT_SUBMIT
} from '../types.js'

const state = {
    statements: [],
    statementTotal: {},
    submiting: false
}

const actions = {
    //添加账单信息，头部追加单个
    addStatement({
        commit
    }, statement) {
        if (statement != null && statement != undefined) {
            commit('ADD_STATEMENT', statement);
        }
    },
    //添加账单信息，尾部追加集合
    addStatements({
        commit
    }, statementList) {
        if (statementList != null && statementList != undefined && statementList.length > 0) {
            commit('ADD_STATEMENTS', statementList);
        }
    },
    //移除账单信息
    delStatement({
        commit
    }, id) {
        for (let index = 0, length = state.statements.length; index < length; index++) {
            if (state.statements[index].id === Number.parseInt(id)) {
                commit('DEL_STATEMENT', index);
                break;
            }
        }
    },
    //修改账单信息
    modifyStatement({
        commit
    }, statement) {
        for (let index = 0, length = state.statements.length; index < length; ++index) {
            if (state.statements[index]['id'] === statement.id) {
                commit('MODIFY_STATEMENT', { index, statement });
                break;
            }
        }
    },
    //获取账单分页列表
    getPagesAsync({
        commit
    }, params) {
        return new Promise(async (resolve, reject) => {
            await api("statement.list", params).then(res => {
                if (res.code === 0) {
                    resolve({ total: res.result.total, items: res.result.items })
                }
            }).catch(e => {
                reject(e)
            })
        });
    },
    //获取账单各类统计信息
    getTotalAsync({
        commit
    }, params) {
        return new Promise(async (resolve, reject) => {
            await api("statement.total", params).then(res => {
                if (res.code === 0) {
                    var total = {};

                    total.monthExpend = Value.returnFloat(res.result.monthExpend);
                    total.monthIcome = Value.returnFloat(res.result.monthIcome);
                    total.monthRepayment = Value.returnFloat(res.result.monthRepayment);
                    total.monthTransfer = Value.returnFloat(res.result.monthTransfer);

                    total.dayExpend = Value.returnFloat(res.result.dayExpend);
                    total.dayIcome = Value.returnFloat(res.result.dayIcome);
                    total.dayRepayment = Value.returnFloat(res.result.dayRepayment);
                    total.dayTransfer = Value.returnFloat(res.result.dayTransfer);

                    resolve(total)
                }
            }).catch(e => {
                reject(e)
            })
        });
    },
}

const mutations = {
    [ADD_STATEMENT](state, data) {
        state.statements.unshift(data);
    },
    [ADD_STATEMENTS](state, data) {
        state.statements = [...state.statements, ...data];
    },
    [DEL_STATEMENT](state, data) {
        state.statements.splice(data, 1);
    },
    [COVER_STATEMENTS](state, data) {
        state.statements = data;
    },
    [MODIFY_STATEMENT](state, data) {
        state.statements[data.index] = data.statement;
    },
    [STATEMENT_SUBMIT](state, data) {
        state.submiting = data;
    }
}


export default {
    state,
    mutations,
    actions
}
