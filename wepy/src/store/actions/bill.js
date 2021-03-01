import { SUBMITING, STATEMENTS, ADDSTATEMENT, MODIFYSTATEMENT, DELSTATEMENT } from '../types/bill'
import { createAction } from 'redux-actions'

export const changeSubmitStatus = createAction(SUBMITING, (status) => {
  return status
})

export const assignmentStatement = createAction(STATEMENTS, (statements) => {
  return statements
})
export const addStatement = createAction(ADDSTATEMENT, (object) => {
  return object
})

export const modifyStatement = createAction(MODIFYSTATEMENT, (object) => {
  return object
})

export const delStatement = createAction(DELSTATEMENT, (id) => {
  return id
})
