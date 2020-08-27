import * as React from 'react'

export default class extends React.Component {
  innerClick = () => {
    console.log('A: react inner click.')
  }

  innerClickCapture = () => {
    console.log('C: react inner click.')
  }

  outerScroll = () => {
    console.log('B: react outer scroll.')
  }

  outerClickCapture = () => {
    console.log('D: react outer click.')
  }

  render() {
    return (
      <div id='outer' onScroll={this.outerScroll}>
        <button id='inner' onClick={this.innerClick}>
          BUTTON
        </button>
      </div>
    )
  }
}
