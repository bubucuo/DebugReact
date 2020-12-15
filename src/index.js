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
  </div>
);

ReactDOM.render(jsx, document.getElementById("root"));

// console.log("React", React.version); //sy-log

// 原生标签节点
// 文本节点
// 函数组件
// 类组件
