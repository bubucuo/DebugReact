import * as React from "react";
import * as ReactDOM from "react-dom";

import {Component, useState} from "react";

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

  componentDidMount() {
    document.getElementById("btn").addEventListener("click", () => {
      this.change(100);
      this.change(200);
    });
  }
  add = () => {
    /**
     * ReactDOM源码中如果加这个可以使用unstable_unbatchedUpdates
     * import { unbatchedUpdates} from 'react-reconciler/src/ReactFiberReconciler';
      unbatchedUpdates as unstable_unbatchedUpdates,
     */
    // ReactDOM.unstable_unbatchedUpdates(() => {
    this.change(1);
    // this.change(2);
    // });
  };

  change = val => {
    this.setState({
      count: this.state.count + val
    });
    console.log("count", this.state.count); //sy-log
  };

  render() {
    return (
      <div className="border">
        <h3>ClassComponent</h3>
        <p>{this.state.count}</p>
        <button onClick={this.add}>add</button>
        <button id="btn">原生</button>
      </div>
    );
  }
}

function FunctionComponent(props) {
  const [count, setCount] = useState(0);
  const [val, setVal] = useState("");

  const add = () => {
    setCount(count + 1);
  };

  React.useEffect(() => {
    console.log("useEffect"); //sy-log
  });
  // React.useLayoutEffect(() => {
  //   console.log("useLayoutEffect"); //sy-log
  // });
  return (
    <div className="border">
      <h3>FunctionComponent</h3>
      <p>{count}</p>
      <button onClick={add}>add</button>
      <input type="text" value={val} onChange={e => setVal(e.target.value)} />
    </div>
  );
}
