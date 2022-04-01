export function createStore(reducer) {
  let currentState;
  let listeners = [];

  function getSnapshot() {
    return currentState;
  }

  function dispatch(action) {
    currentState = reducer(action, currentState);
    listeners.map((listener) => listener());
  }

  function subscribe(listener) {
    listeners.push(listener);

    return () => {
      //   console.log("unmount", listeners);
    };
  }

  dispatch({ type: "TIANNA" });

  return {
    getSnapshot,
    dispatch,
    subscribe,
  };
}
