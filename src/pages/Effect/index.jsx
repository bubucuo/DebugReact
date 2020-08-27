import * as React from 'react'
import {useEffect, useLayoutEffect} from 'react'

export default function UseMemoPage(props) {
  useEffect(() => {
    debugger
    console.log(1)
  }, [])
  useLayoutEffect(() => {
    debugger
    console.log(2)
  })
  return <div>div</div>
}
