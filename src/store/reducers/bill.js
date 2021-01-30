import { handleActions } from 'redux-actions'
import { SUBMITING } from '../types/bill'
import { billData } from './data'

export default handleActions({
  [SUBMITING](state, action) {
    // console.log(action)
    return {
      ...state,
      statementSubmiting: action.payload
    }
  }
}, billData)
