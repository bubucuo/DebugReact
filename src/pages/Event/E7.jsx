import * as React from 'react'

export default class extends React.Component {
  innerClick = () => {
    console.log('A: react inner click.')
  }

  innerClickCapture = () => {
    console.log('C: react inner click.')
  }

  outerClick = () => {
    console.log('B: react outer click.')
  }

  outerClickCapture = () => {
    console.log('D: react outer click.')
  }

  render() {
    return (
      <div id='outer' onScroll={this.outerClick}>
        <button id='inner' onClick={this.innerClick}>
          BUTTON
        </button>
      </div>
    )
  }
}
