import {useCallback, useReducer, useState} from "react";

export default function FunctionComponentForceUpdate(props) {
  console.log("omg"); //sy-log

  // const [count, forceUpdate] = useState(0);
  // ! 方法1
  // const [, forceUpdate] = useReducer((x) => x + 1, 0);

  // ! 方法2
  const forceUpdate = useForceUpdate();

  const handleClick = () => {
    // forceUpdate(count + 1);
    // forceUpdate((prev) => prev + 1);
    forceUpdate();
  };

  return (
    <div>
      <h3>FunctionComponentForceUpdate</h3>
      <button onClick={handleClick}>count</button>
    </div>
  );
}

function useForceUpdate() {
  const [state, setState] = useState(0);
  // const [, setState] = useReducer((x) => x + 1, 0);

  const update = useCallback(() => {
    setState((prev) => prev + 1);
    // setState();
  }, []);

  return update;
}
