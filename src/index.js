import * as React from "react";
import {Component, PureComponent, useState} from "react";
import * as ReactDOM from "react-dom";

import "./index.css";

class ClassComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }
  componentDidMount() {
    document
      .getElementById("handle")
      .addEventListener("click", this.handle, false);
  }

  setCount = () => {
    //ReactDOM.unstable_batchedUpdates(() => {
    this.setState({
      count: this.state.count + 1
    });
    // this.setState({
    //   count: this.state.count + 2
    // });
    console.log("复合事件的count", this.state.count);
    // });
  };
  handle = () => {
    ReactDOM.unstable_batchedUpdates(() => {
      this.setState({
        count: this.state.count + 1 //00
      });
      // this.setState({
      //   count: this.state.count + 2 //00
      // });
      console.log("原生事件的count", this.state.count);
    });
  };
  render() {
    const {name} = this.props;
    const {count} = this.state;
    return (
      <div className="classcmp border">
        <p>{name}</p>
        <p>{count}</p>
        <button onClick={this.setCount}>复合事件{count}</button>
        <button id="handle">原生handle</button>
      </div>
    );
  }
}

// 函数组件
function FunctionComponent(props) {
  // const [count, setCount] = useState(0);
  // const _setCount = () => {
  //   setCount(count + 1);
  // };
  return (
    <div className="function border">
      hello, {props.name}
      {/* <button onClick={_setCount}>count: {count}</button> */}
    </div>
  );
}

const jsx = (
  <div className="app">
    <h1>hello, kkb</h1>
    <FunctionComponent name="function组件" />
    <ClassComponent name="class组件" />
    <p>全栈课学习</p>
    <a href="https://www.kaikeba.com/">跳转</a>
  </div>
);

console.log("当前React版本是:" + React.version);

ReactDOM.render(jsx, document.getElementById("root"));
