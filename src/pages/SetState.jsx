import * as React from 'react'

export default class extends React.Component {
  state = {
    count: 0,
  }

  componentDidMount() {
    // executionContext 是 0
    // setTimeout(() => {
    //   this.setState({count: this.state.count + 1})
    //   this.setState({count: this.state.count + 1})
    // })

    this.setState({count: this.state.count + 1})
    this.setState({count: this.state.count + 1})
  }

  // discreteUpdates
  onClick = () => {
    this.setState({count: this.state.count + 1})
  }

  render() {
    return <div onClick={this.onClick}>{this.state.count}</div>
  }
}
