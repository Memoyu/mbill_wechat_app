import { SUBMITING } from '../types/bill'
import { createAction } from 'redux-actions'

export const changeSubmitStatus = createAction(SUBMITING, (status) => {
  return status
})
