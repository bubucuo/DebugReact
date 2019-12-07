import React, { Component, PureComponent } from "react";

export default class TestPage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      counter: 0
      // obj: {
      //   num: 2
      // }
    };
  }

  setCounter = () => {
    this.setState({
      counter: 100
      // obj: {
      //   num: 200
      // }
    });
  };

  render() {
    const { counter, obj } = this.state;
    console.log("render");
    return (
      <div>
        <h1>PuerComponentPage</h1>
        <div onClick={this.setCounter}>counter: {counter}</div>
      </div>
    );
  }
}
