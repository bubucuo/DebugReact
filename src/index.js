import React, { Component, PureComponent, useState } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import TestPage from "./TestPage";

class ClassCmp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      counter: 0
    };
  }
  setCounter = () => {
    this.setState({
      counter: this.state.counter + 1
    });
    // this.setState({
    //   counter: this.state.counter + 2
    // });
    // console.log("counter", this.state.counter);
  };
  handle = () => {
    ReactDOM.render(jsx, document.getElementById("root"));
  };
  render() {
    const { name } = this.props;
    const { counter } = this.state;
    return (
      <div className="classcmp border">
        <p>{name}</p>
        <button onClick={this.setCounter}>{counter}</button>
        <button onClick={this.handle}>handle</button>
      </div>
    );
  }
}

function HookFunction() {
  const [num, setNum] = useState(0);
  return (
    <div className="hook border">
      <button onClick={() => setNum(num + 1)}>{num}</button>
    </div>
  );
}

let jsx = (
  <div className="box">
    <ClassCmp name="class组件" />
    <div className="ele border">div元素</div>
    <HookFunction />
    <TestPage />
  </div>
);

// console.log("omg", Component.prototype, PureComponent.prototype);
console.log("当前React版本是:" + React.version);

ReactDOM.render(jsx, document.getElementById("root"));
