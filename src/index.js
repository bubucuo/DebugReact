import * as React from "react";
import {Component} from "react";
import * as ReactDOM from "react-dom";

// import React from "./kreact/";
// import ReactDOM, {useState} from "./kreact/react-dom";
// import Component from "./kreact/Component";

import "./index.css";

class ClassCoomponent extends Component {
  render() {
    return (
      <div className="border">
        <p>{this.props.name}</p>
      </div>
    );
  }
}

function FunctionComponent(props) {
  return (
    <div className="border">
      <p>{props.name}</p>
    </div>
  );
}

// ! 常见陷阱
// key在同一个层级下要唯一并且稳定
// 1. key用Math.random()或者Date
// 节点不能复用，每次更新组件都会卸载老的，创建一个新的
// 2. index
// index什么情况下会影响
// 列表顺序不稳定的时候容易出bug，如发生拖动事件

// function FragmentComponent(props) {
//   return [1, 2, 3].map((item, index) => (
//     <React.Fragment key={index}>
//       <li>omg</li>
//       <li>omg2</li>
//     </React.Fragment>
//   ));
// }

const jsx = (
  <div className="border">
    <h1>全栈</h1>
    <a href="https://www.kaikeba.com/">kkb</a>
    <FunctionComponent name="函数组件" />
    <ClassCoomponent name="类组件" />
    <>
      <li>omg</li>
      <li>omg2</li>
    </>
    {/* <ul>
      <FragmentComponent />
    </ul> */}
  </div>
);

ReactDOM.render(jsx, document.getElementById("root"));

// console.log("React", React.version); //sy-log

// 原生标签节点
// 文本节点
// 函数组件
// 类组件
