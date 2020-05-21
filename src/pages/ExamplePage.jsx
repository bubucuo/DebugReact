import {React, Component} from "../CONST";

class ClassComponent extends Component {
  render() {
    return <div className="class border">{this.props.name}</div>;
  }
}

function FunctionComponent({name}) {
  return (
    <div className="function border">
      {name}
      <button onClick={() => console.log("omg")}>click</button>
    </div>
  );
}

const jsx = (
  <div className="box border">
    <p>开课吧</p>
    <a href="https://kaikeba.com/">开课吧</a>
    <FunctionComponent name="函数组件" />
    <ClassComponent name="class组件" />

    {/* <>
      <h1>文本1</h1>
      <h2>文本2</h2>
    </> */}

    {/* // {[1, 2, 3].map(item => (
    //   <div key={item}>文本{item}</div>
    //   // <React.Fragment key={item}>
    //   //   <h1>文本1</h1>
    //   //   <h2>文本2</h2>
    //   // </React.Fragment>
    // ))} */}
  </div>
);

export default jsx;
