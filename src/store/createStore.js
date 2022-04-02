// reducer是状态修改规则
export default function createStore(reducer) {
  let currentState;
  let listeners = [];

  function getState() {
    return currentState;
  }

  function dispatch(action) {
    currentState = reducer(action, currentState);

    listeners.forEach((listener) => listener());
  }

  function subscribe(listener) {
    listeners.push(listener);
  }

  dispatch({ type: "ADDDDDDDDDDDDDDDDD" });

  return {
    getState,
    dispatch,
    subscribe,
  };
}
