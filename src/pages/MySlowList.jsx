import * as React from 'react'
import {memo} from 'react'

// Note: this file is exactly the same in both examples.

function ListItem({children}) {
  let now = performance.now()
  while (performance.now() - now < 3) {
    // Note: this is an INTENTIONALLY EMPTY loop that
    // DOES NOTHING for 3 milliseconds for EACH ITEM.
    //
    // It's meant to emulate what happens in a deep
    // component tree with calculations and other
    // work performed inside components that can't
    // trivially be optimized or removed.
  }
  return <li className='ListItem'>{children}</li>
}

export default memo(function MySlowList({text}) {
  let items = []
  for (let i = 0; i < 80; i++) {
    items.push(
      <ListItem key={i}>
        Result #{i} for "{text}"
      </ListItem>
    )
  }
  return (
    <>
      <p>
        <b>Results for "{text}":</b>
      </p>
      <ul className='List'>{items}</ul>
    </>
  )
})
