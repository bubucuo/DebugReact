import React, { Component } from "react";
import ReactDOM from "react-dom";
import "./index.css";

class ClassCmp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      counter: 0
    };
  }
  // componentDidMount() {
  //   document.getElementById("test").addEventListener("click", () => {
  //     this.setCounter();
  //   });
  // }
  setCounter = () => {
    this.setState({
      counter: this.state.counter + 1
    });
    // this.setState({
    //   counter: this.state.counter + 2
    // });
    // console.log("counter", this.state.counter);
  };
  render() {
    const { name } = this.props;
    const { counter } = this.state;
    return (
      <div className="border">
        <p>{name}</p>
        <button onClick={this.setCounter}>{counter}</button>
        {/* <button id="test">sourceClick-{counter}</button> */}
      </div>
    );
  }
}

let jsx = (
  <div className="box">
    <ClassCmp name="class组件" />
    <div className="border">div元素</div>
  </div>
);

console.log("当前React版本是:" + React.version);

ReactDOM.render(jsx, document.getElementById("root"));
