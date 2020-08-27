import {INCREMENT, DECREASE} from './actionTypes'

export function incrementAction() {
  return {
    type: INCREMENT,
  }
}
export function decreaseAction() {
  return {
    type: DECREASE,
  }
}
