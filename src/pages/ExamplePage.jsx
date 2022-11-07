import classNames from "classnames";
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
    this.state = {count: 0, input: ""};
  }

  handle = () => {
    const {count} = this.state;
    this.setState({count: count + 1});
    this.setState({count: count + 100});
  };
  render() {
    const {count} = this.state;

    return (
      <div className="class border">
        {this.props.name}
        <input
          type="text"
          name=""
          id=""
          value={this.state.input}
          onChange={(e) => this.setState({input: e.target.value})}
        />
        <button onClick={this.handle}>{count}</button>
      </div>
    );
  }
}

function FunctionComponent(props) {
  console.log(
    "%c [  ]-41",
    "font-size:13px; background:pink; color:#bf2c9f;",
    props.info
  );
  const [count1, setCount1] = useReducer((x) => x + 2, 0); //hook2
  const [count2, setCount2] = useReducer((x) => x, 0); //hook2
  const [count3, setCount3] = useState(0);

  // useEffect(() => {
  //   ajax().then((res) => {
  //     setCount1(res.num);
  //   });
  // }, []);

  // useEffect(() => {
  //   // console.log("omg useEffect", count2); //sy-log
  // }, [count2]);

  // useLayoutEffect(() => {
  //   // console.log("omg useLayoutEffect", count1, count2); //sy-log
  // }, [count2]);

  console.log("omg");

  return (
    <div className="border">
      <p>{props.name}</p>
      <button
        onClick={() => {
          setCount1();
        }}>
        {count1}
      </button>
      <button
        onClick={() => {
          setCount2();
        }}>
        {count2}
      </button>
      <button
        onClick={() => {
          setCount3(1);
        }}>
        {count3}
      </button>
    </div>
  );
}

const info = {age: 10};
const _bool = false;

const jsx = (
  <div className="box border" style={{color: "red", lineHeight: "20px"}}>
    <h1 className={"border " + (_bool ? "" : "pink")}>omg</h1>
    <h1
      className={classNames("border", _bool ? "" : "pink", "orange")}
      style={{display: _bool ? "block" : "none"}}>
      omg2
    </h1>

    <h2>ooo</h2>
    <FunctionComponent name="函数组件" info={{data: {info}}} />
    <ClassComponent name="class组件" />
  </div>
);

export default jsx;
