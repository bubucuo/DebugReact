import {React, ReactDOM, useState} from "../CONST";

export default function DiffPage() {
  const [state, setState] = useState(2);

  return (
    <div className="border">
      <button onClick={() => setState(state + 1)}>{state}</button>
      <ul>
        {[0, 1, 2, 3, 4, 5].map((item) => {
          if (item < state && item !== Math.floor(state / 2)) {
            // console.log("ahahshas", item, Math.floor(state / 2)); //sy-log
            return <li key={item}>{item}</li>;
          }
          return null;
        })}
      </ul>
    </div>
  );
}
