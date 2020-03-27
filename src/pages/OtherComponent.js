import React, {Component} from "react";

export default class OtherComponent extends Component {
  state = {
    count: 0
  };
  componentDidMount() {
    setTimeout(() => {
      this.setState({
        count: this.state.count + 1
      });
    }, 1000);
  }
  render() {
    return (
      <div>
        <h3>OtherComponent</h3>
        <p>count: {this.state.count}</p>
      </div>
    );
  }
}
