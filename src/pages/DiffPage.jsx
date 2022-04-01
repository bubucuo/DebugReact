import { React, ReactDOM, useState } from "../whichReact";

// old 1 3 2 5
// new 0 1 2 3 4

// 新增 0 4
// 复用 1 2 3
// 移动 3

function A() {
  return <div>a</div>;
}

function b() {
  return "b";
}
export default function DiffPage() {
  const [count, setCount] = useState(0);

  return (
    <div className="border">
      <button
        onClick={() => {
          setCount(count + 1);
        }}
      >
        {count}
      </button>
      <ul>
        {count === 2
          ? [2, 1, 3, 4].map((item) => {
              return <li key={item}>{item}</li>;
            })
          : [0, 1, 2, 3, 4].map((item) => {
              return <li key={item}>{item}</li>;
            })}
      </ul>

      <A />
      {b()}
    </div>
  );
}
