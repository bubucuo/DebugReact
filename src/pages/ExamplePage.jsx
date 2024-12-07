import {
  Component,
  // useState,
  useReducer,
  useEffect,
  // useLayoutEffect,
} from "react";

class ClassComponent extends Component {
  state = { count: 0 };
  render() {
    return (
      <div className="class border">
        {this.props.name}
        <button
          onClick={() => {
            this.setState({ count: this.state.count + 1 });
            // this.setState({ count: this.state.count + 2 });
          }}
        >
          {this.state.count}
        </button>
      </div>
    );
  }
}

function FunctionComponent(props) {
  const [count1, setCount1] = useReducer((x) => x + 1, 0);

  // passive effect 异步执行
  useEffect(() => {
    // setCount1();
    // return () => {
    //   console.log("销毁");
    // };
  }, [count1]);

  return (
    <div className="border">
      <p>{props.name}</p>
      <button
        onClick={() => {
          setCount1();
        }}
      >
        {count1}
      </button>
    </div>
  );
}

const A = () => [1, 2, 3];

const jsx = (
  <div className="box border">
    <A />
    {/* <h1 className="border">omg</h1> */}
    {/* 123 */}
    <FunctionComponent name="函数组件" />
    <>
      <h1>1</h1>
      <h1>2</h1>
    </>
  </div>
);

export default jsx;

// document.createDocumentFragment

// ! 原生节点 有对应的dom节点
// 1. 原生标签节点 div\span\a等 HostComponent
// 2. 文本节点

// ! 非原生节点 没有对应的dom节点
// 函数组件、类组件、Provider、Consumer、Fragment等
