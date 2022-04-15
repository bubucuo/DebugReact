import {
  useId,
  useSyncExternalStore,
  useInsertionEffect,
  useState,
  useEffect,
  useLayoutEffect,
  useReducer,
} from "../whichReact";

import store from "../store/";

export default function NewHookApi({ storeProps }) {
  const id = useId();

  // const state = store.getState();

  // const [, forceUpdate] = useReducer((x) => x + 1, 0);

  // useEffect(() => {
  //   store.subscribe(() => {
  //     forceUpdate();
  //   });
  // }, []);

  const state = useSyncExternalStore(store.subscribe, store.getState);

  useInsertionEffect(() => {
    // debugger;
  }, []);
  useLayoutEffect(() => {
    // debugger;
  }, []);
  useEffect(() => {
    // debugger;
  }, []);

  return (
    <div>
      <h3 id={id}>NewHookApi</h3>

      <button
        onClick={() => {
          store.dispatch({ type: "ADD" });
        }}
      >
        state-: {state}
      </button>
      {/* <button onClick={() => setCount(count + 1)}>count: {count}</button>  */}
    </div>
  );
}
