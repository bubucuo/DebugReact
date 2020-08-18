import * as React from 'react'
import {useState, unstable_useDeferredValue} from 'react'
import * as ReactDOM from 'react-dom'
import MySlowList from './MySlowList'

function App() {
  const [text, setText] = useState('hello')

  // This is a new feature in Concurrent Mode.
  // This value is allowed to "lag behind" the text input:
  const deferredText = unstable_useDeferredValue(text, {
    timeoutMs: 5000,
  })

  function handleChange(e) {
    setText(e.target.value)
  }

  return (
    <div className='App'>
      <h1>React With Concurrent Mode</h1>
      <label>
        Type into the input: <input value={text} onChange={handleChange} />
      </label>
      <p>
        Even though each list item in this demo completely blocks the main
        thread for 3 milliseconds, the app is able to stay responsive in
        Concurrent Mode.
      </p>
      <hr />
      {/* Pass the "lagging" value to the list */}
      <MySlowList text={deferredText} />
    </div>
  )
}

const rootElement = document.getElementById('root')
// Opt into Concurrent Mode:
debugger
ReactDOM.unstable_createRoot(rootElement).render(<App />)
