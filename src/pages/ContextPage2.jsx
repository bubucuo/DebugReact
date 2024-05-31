import {
  Component,
  useReducer,
  useState,
  createContext,
  useContext,
} from "react";

const CountContext = createContext(-999);
const MyBGContext = createContext("red");

export default function ContextPage2() {
  const [count, setCount] = useReducer((x) => x + 1, 0);
  const [bgColor, setBgColor] = useState("red");

  return (
    <div className="border">
      <button onClick={() => setCount()}>{count}</button>
      <button onClick={() => setBgColor(getRandomColor())}>
        change theme color
      </button>

      {/* 没有匹配的Provider，取值默认值 */}
      <Child desc="没有匹配的Provider，取值默认值" />

      {/* 匹配到多个Provider，取最近的那个 */}
      <CountContext.Provider value={999}>
        <CountContext.Provider value={count}>
          <Child desc="匹配到多个Provider，取最近的那个 " />

          <MyBGContext.Provider value={bgColor}>
            <Child desc="不同Context Provider嵌套" />
          </MyBGContext.Provider>
        </CountContext.Provider>
      </CountContext.Provider>
    </div>
  );
}

function Child({ desc }) {
  const background = useContext(MyBGContext);
  const count = useContext(CountContext);
  return (
    <div className="border" style={{ background }}>
      <h3>{desc}</h3>
      <h5>{count}</h5>
      <CountContext.Consumer>{(ctx) => <h5>{ctx}</h5>}</CountContext.Consumer>
      <ClassComponent />
    </div>
  );
}

class ClassComponent extends Component {
  static contextType = CountContext;
  render() {
    return (
      <div className="border">
        <p>类组件:{this.context}</p>
      </div>
    );
  }
}

function getRandomColor(props) {
  return "#" + Math.floor(Math.random() * Math.pow(10, 6));
}
