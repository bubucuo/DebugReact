const initialState = {
  value: 0,
}

function addReducer(state = initialState, action) {
  switch (action.type) {
    case 'INCREMENT':
      return {...state, value: state.value + 1}
    case 'DECREASE':
      return {...state, value: state.value - 1}
    default:
      return state
  }
}

export default addReducer
