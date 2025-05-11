import { useState, use, Suspense, createContext, useContext } from "react";
import * as React from "react";
import { ErrorBoundary } from "react-error-boundary";

const Context = createContext();

function fetchMessage() {
  // return new Promise((resolve, reject) => setTimeout(resolve("Hello"), 1000));
  // return new Promise((resolve, reject) => setTimeout(reject, 1000));
  return fetch("https://randomuser.me/api").then((x) => x.json());
}

export default function UsePage() {
  const [num, setNum] = useState(0);
  const [messagePromise, setMessagePromise] = useState(null);
  const [show, setShow] = useState(false);
  function download() {
    setMessagePromise(fetchMessage());
    setShow(true);
  }

  if (show) {
    return (
      <Context value={num}>
        <button onClick={() => setNum(num + 1)}>{num}</button>
        <MessageContainer messagePromise={messagePromise} />
      </Context>
    );
  } else {
    return <button onClick={download}>Download message</button>;
  }
}

function MessageContainer({ messagePromise }) {
  return (
    <ErrorBoundary fallback={<p>⚠️Something went wrong</p>}>
      <Suspense fallback={<p>⌛Downloading message...</p>}>
        <Message messagePromise={messagePromise} />
      </Suspense>
    </ErrorBoundary>
  );
}

// use的父组件不要写太复杂
function Message({ messagePromise }) {
  const content = use(messagePromise);
  const ctx = 1 < 2 && use(Context);
  const ctx2 = useContext(Context);
  console.log(
    "%c [ ctx ]-48",
    "font-size:13px; background:pink; color:#bf2c9f;",
    ctx,
    ctx2
  );

  const user = content.results[0].name.first;
  return <p>Here is the message: {user}</p>;
}
