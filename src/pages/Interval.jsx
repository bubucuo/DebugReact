import * as React from 'react'
import {useReducer, useEffect} from 'react'

function reducer(state, action) {
  if (action.type === 'ADD') {
    console.log(state)
    return state + 1
  }
  return state
}

export default function App() {
  const [count, dispatch] = useReducer(reducer, 0)
  useEffect(() => {
    const timer = setInterval(() => {
      dispatch({type: 'ADD'})
      console.log('dispatch')
    }, 1000)
    return () => clearInterval(timer)
  }, [])
  return <div>is: {count}</div>
}
