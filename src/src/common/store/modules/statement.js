import store from '@/common/store'
import {
    ADD_STATEMENT,
    ADD_STATEMENTS,
    DEL_STATEMENT,
    MODIFY_STATEMENT,
    STATEMENT_SUBMIT
} from '../types.js'

const state = {
    statements: [],
    submiting: false
}

const actions = {
    //添加账单信息，头部追加单个
    addStatement({
        commit
    },statement) {
        if (statement != null && statement != undefined) {
            commit('ADD_STATEMENT', statement);
        }
    },
     //添加账单信息，尾部追加集合
    addStatements({
        commit
    },statementList) {
        if (statementList != null && statementList != undefined && statementList.length > 0) {
            commit('ADD_STATEMENTS', statementList);
        }
    },
    //移除账单信息
    delStatement({
        commit
    },id) {
        for(let index = 0, length = state.statements.length; index < length; index++) {
            if (state.statements[index].id === Number.parseInt(id)) {
              commit('DEL_STATEMENT', index);
              break;
            }
        }
    },
    //移除账单信息
    modifyStatement({
        commit
    },statement) {
        for(let index = 0, length = state.statements.length; index < length; ++index) {
            if (state.statements[index]['id'] === statement.id) {
                commit('MODIFY_STATEMENT', {index, statement});
              break;
            }
        }
    },


}

const mutations = {
    [ADD_STATEMENT](state, data) {
		state.statements.unshift(data);
	},
    [ADD_STATEMENTS](state, data) {
		state.statements =  [...state.statements, ...data];
	},
    [DEL_STATEMENT](state, data) {
		state.statements.splice(data, 1);
	},
    [MODIFY_STATEMENT](state, data) {
		state.statements[data.index] = data.statement;
	}, 
    [STATEMENT_SUBMIT](state, data) {
		state.submiting = data;
	},
}


export default {
	state,
	mutations,
	actions
}
