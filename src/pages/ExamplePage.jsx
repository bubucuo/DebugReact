import {
  Component,
  useState,
  useReducer,
  useEffect,
  useLayoutEffect,
} from "../whichReact";

class ClassComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  handle = () => {
    const { count } = this.state;
    this.setState({ count: count + 1 });
    this.setState({ count: count + 100 });
  };
  render() {
    const { count } = this.state;

    return (
      <div className="class border">
        {this.props.name}
        <button onClick={this.handle}>{count}</button>
      </div>
    );
  }
}

function FunctionComponent(props) {
  const [count1, setCount1] = useReducer((x) => x + 2, 0); //hook2
  const [count2, setCount2] = useReducer((x) => x + 1, 0); //hook2

  // useEffect(() => {
  //   // console.log("omg useEffect", count2); //sy-log
  // }, [count2]);

  // useLayoutEffect(() => {
  //   // console.log("omg useLayoutEffect", count1, count2); //sy-log
  // }, [count2]);

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
      <button
        onClick={() => {
          setCount2();
        }}
      >
        {count2}
      </button>
    </div>
  );
}

const jsx = (
  <div className="box border">
    <h1>omg</h1>
    <h2>ooo</h2>
    <FunctionComponent name="函数组件" />
    <ClassComponent name="class组件" />
  </div>
);

export default jsx;
