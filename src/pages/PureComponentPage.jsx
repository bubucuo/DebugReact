import * as React from "react";
import {Component, PureComponent} from "react";

export default class PureComponentPage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      counter: 0
    };
  }

  setCounter = () => {
    this.setState({
      counter: 100
      // obj: {num: 0}
    });
  };

  render() {
    const {counter, obj} = this.state;
    console.log("render");
    return (
      <div>
        <h1>PuerComponentPage</h1>
        <button onClick={this.setCounter}>counter: {counter}</button>
      </div>
    );
  }
}
