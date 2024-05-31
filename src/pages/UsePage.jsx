import { useState, use, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
// import { MessageContainer } from "./message.js";

function fetchMessage() {
  return new Promise((resolve, reject) => setTimeout(reject, 1000));
}

export default function UsePage() {
  const [messagePromise, setMessagePromise] = useState(null);
  const [show, setShow] = useState(false);
  function download() {
    setMessagePromise(fetchMessage());
    setShow(true);
  }

  if (show) {
    return <MessageContainer messagePromise={messagePromise} />;
  } else {
    return <button onClick={download}>Download message</button>;
  }
}

function MessageContainer({ messagePromise }) {
  console.log(
    "%c [ MessageContainer ]-25",
    "font-size:13px; background:pink; color:#bf2c9f;"
  );
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
  console.log(
    "%c [ msg ]-26",
    "font-size:13px; background:pink; color:#bf2c9f;"
  );
  const content = use(messagePromise);
  return <p>Here is the message: {content}</p>;
}
