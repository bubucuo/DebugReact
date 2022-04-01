import { useStore } from "../store2";
import {
  useId,
  useSyncExternalStore,
  useInsertionEffect,
  useState,
  useEffect,
  useLayoutEffect,
  useReducer,
} from "../whichReact";

export default function NewHookApi({ storeProps }) {
  const id = useId();

  const store = useStore(storeProps);

  // const state = store.getSnapshot();

  // const [, forceUpdate] = useReducer((x) => x + 1, 0);

  // useEffect(() => {
  //   store.subscribe(() => {
  //     forceUpdate();
  //   });
  // }, []);

  const state = useSyncExternalStore(store.subscribe, store.getSnapshot);

  const [count, setCount] = useState(0);

  useInsertionEffect(() => {
    // debugger;

    console.log("useInsertionEffect"); //sy-log
  }, [count]);

  useLayoutEffect(() => {
    // debugger;

    console.log("useLayoutEffect"); //sy-log
  }, [count]);

  useEffect(() => {
    // debugger;

    console.log("useEffect"); //sy-log
  }, [count]);

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
