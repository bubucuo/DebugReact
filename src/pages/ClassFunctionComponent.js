import React, {Component, useState} from "react";

export default class ClassFunctionComponent extends Component {
  render() {
    return (
      <div>
        <h3>ClassFunctionComponent</h3>
        <ClassComponent />
        <FunctionComponent />
      </div>
    );
  }
}

class ClassComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {count: 0};
  }

  add = () => {
    this.setState({
      count: this.state.count + 1
    });
  };

  render() {
    return (
      <div className="border">
        <h3>ClassComponent</h3>
        <p>{this.state.count}</p>
        <button onClick={this.add}>add</button>
      </div>
    );
  }
}

function FunctionComponent(props) {
  const [count, setCount] = useState(0);
  const add = () => {
    setCount(count + 1);
  };
  return (
    <div className="border">
      <h3>FunctionComponent</h3>
      <p>{count}</p>
      <button onClick={add}>add</button>
    </div>
  );
}
