import React, { Component } from "react";
import ReactDOM from "react-dom";
import "./index.css";

class ClassCmp extends Component {
  state = { counter: 0 };
  setCounter = () => {
    this.setState({
      counter: this.state.counter + 1
    });
  };
  render() {
    const { name } = this.props;
    const { counter } = this.state;
    return (
      <div className="border">
        <p>{name}</p>
        <button onClick={this.setCounter}>{counter}</button>
      </div>
    );
  }
}

const jsx = (
  <>
    <ClassCmp name="class组件" />
  </>
);

console.log("当前React版本是:" + React.version);

ReactDOM.render(jsx, document.getElementById("root"));
