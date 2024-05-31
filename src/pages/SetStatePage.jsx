import {flushSync, Component, useState, useEffect} from "../whichReact";

// React 18以前
// setState在合成事件中，是异步执行（批量执行）
// 但是在setTimeout、或者原生事件中就是同步的
export default class SetStatePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
    };
  }
  componentDidMount() {
    document.getElementById("host").addEventListener(
      "click",
      //// 即react-reconciler/src/ReactFiberWorkLoop.js batchedUpdates
      // //() => ReactDOM.unstable_batchedUpdates(this.changeCount),
      this.changeCount,
      false
    );
  }

  changeCount = () => {
    const {count} = this.state;
    flushSync(() => {
      this.setState({
        count: count + 1,
      });
    });

    console.log("改变count", this.state.count); //sy-log
  };

  changeCountWithSetTimeout = () => {
    setTimeout(() => {
      this.changeCount(); // setState
    }, 0);
  };

  render() {
    console.log("render"); //sy-log
    const {count} = this.state;
    return (
      <div>
        <h3>类组件SetStatePage</h3>
        <p>count: {count}</p>
        <button onClick={this.changeCount}>change count 合成事件</button>

        <button onClick={this.changeCountWithSetTimeout}>
          合成事件 setTimeout click
        </button>

        <button id="host">原生事件</button>

        <FCSetStatePage />
      </div>
    );
  }
}

function FCSetStatePage(props) {
  const [count, setCount] = useState(0);
  const handle = () => {
    flushSync(() => {
      setCount(count + 1);
    });
    // console.log("count", count); //sy-log
  };

  useEffect(() => {
    console.log(
      "%c [  ]-73",
      "font-size:13px; background:pink; color:#bf2c9f;",
      count
    );
  }, [count]);

  return (
    <div>
      <h3>函数组件SetStatePage</h3>
      <button onClick={handle}>{count}</button>
    </div>
  );
}
