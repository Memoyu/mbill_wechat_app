import { handleActions } from 'redux-actions'
import { SUBMITING, STATEMENTS, ADDSTATEMENT, MODIFYSTATEMENT, DELSTATEMENT } from '../types/bill'
import { billData } from './data'

export default handleActions({
  [SUBMITING](state, action) {
    // console.log(action)
    return {
      ...state,
      statementSubmiting: action.payload
    }
  },
  [STATEMENTS](state, action) {
    console.log(action)
    return {
      ...state,
      statements: action.payload
    }
  },
  [ADDSTATEMENT](state, res) {
    return {
      ...state
    }
  },
  [MODIFYSTATEMENT](state, res) {
    return {
      ...state
    }
  },
  [DELSTATEMENT](state, res) {
    return {
      ...state
    }
  }
}, billData)
