import * as React from 'react'
import {useState} from 'react'
import * as ReactDOM from 'react-dom'
import MySlowList from './MySlowList'

function App() {
  const [text, setText] = useState('hello')

  function handleChange(e) {
    setText(e.target.value)
  }

  return (
    <div className='App'>
      <h1>React Without Concurrent Mode</h1>
      <label>
        Type into the input: <input value={text} onChange={handleChange} />
      </label>
      <p>
        Each list item in this demo completely blocks the main thread for 3
        milliseconds. This makes typing into the input stutter because updates
        are not interruptible.
      </p>
      <hr />
      <MySlowList text={text} />
    </div>
  )
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
