// import React, { Component, PureComponent, useState } from "react";
// import ReactDOM from "react-dom";

import React from "./kreact-test/";
import ReactDOM, { useState } from "./kreact-test/ReactDOM";
import Component from "./kreact-test/Component";

import "./index.css";
import TestPage from "./TestPage";

console.log("ReactDOM", ReactDOM);

class ClassComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0
        };
    }
    setCount = () => {
        console.log("setCount");
        this.setState({
            count: this.state.count + 1
        });
        // this.setState({
        //   count: this.state.count + 2
        // });
        // console.log("count", this.state.count);
    };
    handle = () => {
        ReactDOM.render(jsx, document.getElementById("root"));
    };
    render() {
        const { name } = this.props;
        const { count } = this.state;
        return (
            <div className="classcmp border">
                <p>{name}</p>
                <button onClick={this.setCount}>{count}</button>
                <button onClick={this.handle}>handle</button>
            </div>
        );
    }
}

// 函数组件
function FunctionComponent(props) {
    const [count, setCount] = useState(0);
    const _setCount = () => {
        setCount(count + 1);
    };
    return (
        <div className="function border">
            hello, {props.name}
            <button onClick={_setCount}>count: {count}</button>
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

// console.log("omg", Component.prototype, PureComponent.prototype);
console.log("当前React版本是:" + React.version);

ReactDOM.render(jsx, document.getElementById("root"));
