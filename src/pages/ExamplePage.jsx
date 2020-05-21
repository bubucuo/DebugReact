import React, {useState, useEffect, useLayoutEffect, useMemo} from "react";

export default function ExamplePage(props) {
  const [count, setCount] = useState(0);
  const [count2, setCount2] = useState(-1);

  return (
    <div>
      <h1>ExamplePage</h1>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
      <ChildHook />
    </div>
  );
}

function ChildHook(props) {
  useEffect(() => {
    document.title = num + "次";
    return () => (document.title = "未知次");
  }, []);

  const [num, setNum] = useState(100);

  useLayoutEffect(() => {
    console.log("test"); //sy-log
    document.title = "0" + num + "次";
  });

  const expensive = useMemo(() => {
    let res = 1;
    for (let i = 1; i < num / 10; i++) {
      res *= i;
    }
    return res;
  }, [num]);

  return (
    <div>
      omg ChildHook
      <p>expensive:{expensive}</p>
      <button onClick={() => setNum(num + 1)}>omg {num}</button>
    </div>
  );
}
