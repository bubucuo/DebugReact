import { useReducer, useState, useEffect, useLayoutEffect } from "react";
import * as React from "react";

export default function FunctionComponent() {
  const [count1, setCount1] = useReducer((x) => x + 1, 1);
  const [count2, setCount2] = useState(1);
  const [txt, setTxt] = useState("");

  // useLayoutEffect(() => {
  //   console.log("useLayoutEffect"); //sy-log
  //   return () => {
  //     console.log("useLayoutEffect: before update or before unmount"); //sy-log
  //   };
  // }, [count1]);

  // useEffect(() => {
  //   console.log("useEffect"); //sy-log
  //   return () => {
  //     console.log("useEffect: before update or before unmount"); //sy-log
  //   };
  // }, [count2]);
  return (
    <div className="border">
      <h3>函数组件</h3>
      <button
        onClick={() => {
          setCount1();
        }}
      >
        {count1}
      </button>
      <button
        onClick={() => {
          setCount2(count2 + 1);
        }}
      >
        {count2}
      </button>

      {count1 % 3 !== 0 ? <Child count1={count1} count2={count2} /> : null}

      <input
        type="text"
        value={txt}
        onChange={(e) => {
          console.log(
            "%c [  ]-31",
            "font-size:13px; background:pink; color:#bf2c9f;",
            e.target.value
          );
          setTxt(e.target.value);
        }}
      />
    </div>
  );
}

function Child({ count1, count2 }: { count1: number, count2: number }) {
  useLayoutEffect(() => {
    console.log("useLayoutEffect Child"); //sy-log
    return () => {
      console.log("useLayoutEffect: before update or before unmount"); //sy-log
    };
  }, [count1]);

  useEffect(() => {
    console.log("useEffect Child"); //sy-log
    return () => {
      console.log("useEffect: before update or before unmount"); //sy-log
    };
  }, [count2]);

  return <div>Child</div>;
}
