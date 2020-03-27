import * as React from "react";
import {Component, memo} from "react";

export default class ReactMemoPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      count: 0
    };
  }
  render() {
    const {count, date} = this.state;
    console.log("render", count);
    return (
      <div>
        <h1>ReactMemoPage</h1>
        <button onClick={() => this.setState({count: count + 1})}>
          click add {count}
        </button>
        <button onClick={() => this.setState({date: new Date()})}>
          click reset {date.toLocaleTimeString()}
        </button>
        <MemoCounter count={count} />
      </div>
    );
  }
}

const MemoCounter = memo(
  props => {
    console.log("MemoCounter");
    return <div>MemoCounter-{props.count}</div>;
  }
  // ,
  // (prevProps, nextProps) => {
  //   return prevProps.count.count === nextProps.count.count;
  // }
);
