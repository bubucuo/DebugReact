import * as React from 'react'

export default class extends React.Component {
  constructor(props) {
    super(props)
    document.addEventListener('click', () => {
      console.log('C: document click 1')
    })
  }

  innerClick = (e) => {
    e.stopPropagation()
    console.log('A: react inner click.')
  }

  outerScroll = () => {
    console.log('B: react outer click.')
  }

  componentDidMount() {
    document.addEventListener('click', (e) => {
      console.log('D: document click 2')
      e.stopImmediatePropagation()
    })
    document.addEventListener('click', (e) => {
      console.log('E: document click 3')
    })
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
