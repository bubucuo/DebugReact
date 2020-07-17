import {React, ReactDOM, useState} from "../CONST";

// import React from "../kreact/";
// import {useState} from "../kreact/ReactDOM";

export default function DiffPage(props) {
  const [count, setCount] = useState(0);
  return (
    <div className="border">
      <button onClick={() => setCount(count + 1)}>{count}： count add</button>

      {count % 2 ? (
        <ul>
          <li key="0">0</li>
          <li key="1">1</li>
          <li key="2">2</li>
          <li key="3">3</li>
          <li key="4">4</li>
        </ul>
      ) : (
        <ul>
          <li key="0">0</li>
          <li key="2">2</li>
          <li key="3">3</li>
          <li key="4">4</li>
        </ul>
      )}

      {/* <ul>
        <li key="0">0</li>
        {count % 2 ? <li key="1">1</li> : null}
        <li key="2">2</li>
        <li key="3">3</li>
        <li key="4">4</li>
      </ul> */}
    </div>
  );
}
