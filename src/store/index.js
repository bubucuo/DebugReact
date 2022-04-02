import createStore from "./createStore";

const store = createStore(countReducer);

export default store;

function countReducer(action, state = 0) {
  switch (action.type) {
    case "ADD":
      return state + 1;
    case "MINUS":
      return state - 1;
    default:
      return state;
  }
}
