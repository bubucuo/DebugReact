import * as ReactDOM from "react-dom";
import * as React from "react";
import {Component} from "react";

export default class SetStatePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }
  componentDidMount() {
    document.getElementById("host").addEventListener(
      "click",
      // 即react-reconciler/src/ReactFiberWorkLoop.js batchedUpdates
      // () => ReactDOM.unstable_batchedUpdates(this.changeCount),
      this.changeCount,
      false
    );
  }
  changeValue = (v, callback) => {
    const {count} = this.state;
    if (callback) {
      this.setState(
        {
          count: count + v
        },
        nextState => {
          console.log("nex", this.state); //sy-log
        }
      );
    } else {
      this.setState({
        count: count + v
      });
    }
  };
  changeCount = () => {
    this.changeValue(1);
    // this.changeValue(2);
    // this.changeValue(3);

    console.log("改变count", this.state.count); //sy-log
  };

  changeCountWithCallback = () => {
    this.changeValue(1, nextState => {
      console.log("nextState", nextState); //sy-log
    });
  };

  changeCountWithSetTimeout = () => {
    setTimeout(() => {
      this.changeCount();
    }, 0);
  };

  render() {
    const {count} = this.state;
    return (
      <div>
        <h3>SetStatePage</h3>
        <p>count: {count}</p>
        <button onClick={this.changeCount}>change count 合成事件</button>
        <button onClick={this.changeCountWithCallback}>
          change count 合成事件 with callback
        </button>

        <button onClick={this.changeCountWithSetTimeout}>
          合成事件 setTimeout click
        </button>

        <button id="host">原生事件</button>
      </div>
    );
  }
}
