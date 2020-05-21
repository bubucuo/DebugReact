import * as React from "react";
import {useReducer} from "react";

const counterReducer = (state = 0, {type, payload = 1}) => {
  switch (type) {
    case "ADD":
      return state + payload;
    case "MINUS":
      return state - payload;
    default:
      return state;
  }
};

export default function UseReducerPage(props) {
  const [state, dispatch] = useReducer(counterReducer, 0);

  console.log("state", state); //sy-log

  const add2 = () => {
    dispatch(() => {
      setTimeout(() => {
        console.log("sssss", arguments); //sy-log
      }, 1000);
    });
  };
  return (
    <div>
      <h3>UseReducerPage</h3>
      <p>{state}</p>
      <button onClick={() => dispatch({type: "ADD"})}>add</button>
      <button onClick={add2}>add2</button>
    </div>
  );
}
