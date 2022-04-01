import { useState, useEffect, useReducer } from "./whichReact";
import NewHookApi from "./pages/NewHookApi";
import { useStore } from "./store2";

export default function App(props) {
  const [count, setCount] = useState(1);

  const store = useStore();

  const state = store.getSnapshot();

  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    store.subscribe(() => {
      forceUpdate();
    });
  }, []);

  return (
    <div>
      <h3>App</h3>
      <button onClick={() => setCount(count + 1)}>App count:{count}</button>

      <button
        onClick={() => {
          store.dispatch({ type: "ADD" });
        }}
      >
        App state: {state}
      </button>

      {count % 2 ? <NewHookApi storeProps={store} /> : null}
    </div>
  );
}
