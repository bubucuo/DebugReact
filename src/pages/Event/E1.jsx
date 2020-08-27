import * as React from 'react'

export default class App extends React.Component {
  innerClick = () => {
    console.log('A: react inner click.')
  }

  outerClick = (e) => {
    console.log('B: react outer click.')
  }

  render() {
    return (
      <div id='outer' onClickCapture={this.outerClick}>
        <button id='inner' onClick={this.innerClick}>
          BUTTON
        </button>
      </div>
    )
  }
}
