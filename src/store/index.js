import { useRef } from "../whichReact";
import { createStore } from "./createStore";

export function useStore() {
  const storeRef = useRef();

  if (!storeRef.current) {
    storeRef.current = createStore(countReducer);
  }

  return storeRef.current;
}

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
