import { useState, useCallback, memo, useEffect } from "react";

export default function UseCallbackPage(props) {
  const [count, setCount] = useState(0);
  const addClick = useCallback(() => {
    let sum = 0;
    for (let i = 0; i < count; i++) {
      sum += i;
    }
    return sum;
  }, [count]);

  // const addClick = () => {
  //   let sum = 0;
  //   for (let i = 0; i < count; i++) {
  //     sum += i;
  //   }
  //   return sum;
  // };
  const [value, setValue] = useState("");
  return (
    <div>
      <h3>UseCallbackPage</h3>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>add</button>
      <input value={value} onChange={(event) => setValue(event.target.value)} />
      <ChildMemo addClick={addClick} />
    </div>
  );
}

const ChildMemo = memo(function Child({ addClick }) {
  useEffect(() => {
    return () => {
      console.log("destroy"); //sy-log
    };
  }, []);
  console.log("Child"); //sy-log
  return (
    <div className="border">
      <button onClick={() => console.log(addClick())}>add</button>
    </div>
  );
});

// class Child extends PureComponent {
//   render() {
//     console.log("child render");
//     const { addClick } = this.props;
//     return (
//       <div>
//         <h3>Child</h3>
//         <button onClick={() => console.log(addClick())}>add</button>
//       </div>
//     );
//   }
// }
