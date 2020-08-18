import * as React from 'react'
import {useState, useEffect} from 'react'

function Name({name}) {
  return <span>{name}</span>
}

function Gender() {
  return <i>Male</i>
}

export default function App() {
  const [name, setName] = useState('ayou')
  useEffect(() => {
    setTimeout(() => {
      setName('yoyo')
    }, 2000)
  }, [])
  return (
    <div>
      <Name name={name} />
      <p>I am 18</p>
      <Gender />
    </div>
  )
}
