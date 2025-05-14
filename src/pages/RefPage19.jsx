import * as React from "react";

export default function RefPage19(props) {
  const [count, setCount] = React.useState(0);
  const inputRef = React.useRef(null);
  return (
    <div>
      <h3>RefPage19</h3>
      <button onClick={() => setCount(count + 1)}>{count}</button>
      {!!(count % 2) && (
        <>
          <input
            ref={(ref) => {
              inputRef.current = ref; // ref created
              // ref created
              // NEW: return a cleanup function to reset
              // the ref when element is removed from DOM.
              return () => {
                console.log("ref cleanup"); //sy-log
              };
            }}
          />
          <Child ref={inputRef} count={count} />
        </>
      )}
    </div>
  );
}

function Child({ ref, count }) {
  return (
    <div>
      <p>count: {count}</p>
      <button
        onClick={() => {
          ref.current.focus();
        }}
      >
        focus the input
      </button>
    </div>
  );
}
