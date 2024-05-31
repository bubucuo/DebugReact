import { Component } from "react";

export default class AboutThisPage extends Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
    // this.handle = this.handle.bind(this);
  }

  handleOfArrow = (arg) => {
    console.log("箭头函数 this", this); //sy-log
    this.setState({ count: this.state.count + 1 });
  };

  handle() {
    console.log("标准函数 this", this); //sy-log
  }

  render() {
    return (
      <div>
        <h3>AboutThisPage</h3>
        <p>{this.state.count}</p>
        <button onClick={this.handleOfArrow}>箭头函数</button>
        <button onClick={(...arg) => this.handle(arg)}>标准函数</button>
      </div>
    );
  }
}

console.log(1);

setTimeout(function () {
  console.log(2);
});

Promise.resolve().then(function () {
  console.log(3);
});

Promise.resolve().then(function () {
  setTimeout(function () {
    console.log(4);
  });
});

Promise.resolve().then(function () {
  console.log(5);
});

setTimeout(function () {
  console.log(6);
});

console.log(7);
