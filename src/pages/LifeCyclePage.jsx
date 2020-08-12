import * as React from "react";

import PropTypes from "prop-types";
/* 
V17以后可能会废弃的三个生命周期函数用getDerivedStateFromProps替代，目前使用的话加上UNSAFE_：
- componentWillMount
- componentWillReceiveProps
- componentWillUpdate
 */

export default class LifeCyclePage extends React.Component {
  static defaultProps = {
    msg: "omg"
  };
  static propTypes = {
    msg: PropTypes.string.isRequired
  };
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
    console.log("constructor", this.state.count);
  }

  static getDerivedStateFromProps(props, state) {
    // getDerivedStateFromProps 会在调用 render 方法之前调用，
    //并且在初始挂载及后续更新时都会被调用。
    //它应返回一个对象来更新 state，如果返回 null 则不更新任何内容。
    const {count} = state;
    console.log("getDerivedStateFromProps", count);
    return count < 5 ? null : {count: 0};
  }
  //在render之后，在componentDidUpdate之前。
  getSnapshotBeforeUpdate(prevProps, prevState, snapshot) {
    const {count} = prevState;
    console.log("getSnapshotBeforeUpdate", count);
    // return null;
    return {pos: {x: 100, y: 101}};
  }
  /* UNSAFE_componentWillMount() {
    //不推荐，将会被废弃
    console.log("componentWillMount", this.state.count);
  } */
  componentDidMount() {
    console.log("componentDidMount", this.state.count);
  }
  componentWillUnmount() {
    //组件卸载之前
    console.log("componentWillUnmount", this.state.count);
  }
  /* UNSAFE_componentWillUpdate() {
    //不推荐，将会被废弃
    console.log("componentWillUpdate", this.state.count);
  } */
  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log("componentDidUpdate", this.state.count, prevState, snapshot);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const {count} = nextState;
    console.log("shouldComponentUpdate", count, nextState.count);
    return count !== 3;
  }

  setCount = () => {
    this.setState({
      count: this.state.count + 1
    });
  };

  render() {
    const {count} = this.state;
    console.log("render", this.state);
    return (
      <div>
        <h1>我是LifeCycle页面</h1>
        <p>{count}</p>
        <button onClick={this.setCount}>改变count</button>
        {/* {!!(count % 2) && <Foo />} */}
        <Child count={count} />
      </div>
    );
  }
}

class Child extends React.Component {
  UNSAFE_componentWillReceiveProps(nextProps) {
    //不推荐，将会被废弃
    // UNSAFE_componentWillReceiveProps() 会在已挂载的组件接收新的 props 之前被调用
    console.log("Foo componentWillReceiveProps", nextProps);
  }
  componentWillUnmount() {
    //组件卸载之前
    console.log(" Foo componentWillUnmount");
  }
  render() {
    return (
      <div style={{border: "solid 1px black", margin: "10px", padding: "10px"}}>
        我是Foo组件
        <div>Foo count: {this.props.count}</div>
      </div>
    );
  }
}
