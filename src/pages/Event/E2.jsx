import * as React from 'react'

export default class extends React.Component {
  innerClick = (e) => {
    console.log('A: react inner click.')
    e.stopPropagation()
  }

  outerClick = () => {
    console.log('B: react outer click.')
  }

  componentDidMount() {
    document.getElementById('outer').addEventListener('click', () => {
      console.log('C: native outer click')
    })
    document.getElementById('inner').addEventListener('click', () => {
      console.log('D: native inner click')
    })
  }

  render() {
    return (
      <div id='outer' onClick={this.outerClick}>
        <button id='inner' onClick={this.innerClick}>
          BUTTON
        </button>
      </div>
    )
  }
}
