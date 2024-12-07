import { useOptimistic, useState, useRef } from "react";
import { updateSomething } from "../utils";

function Thread({ messages, sendMessage }) {
  const formRef = useRef();
  async function formAction(formData) {
    addOptimisticMessage(formData.get("message"));
    formRef.current.reset();
    await sendMessage(formData);
  }
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage) => [
      ...state,
      {
        text: newMessage,
        sending: true,
      },
    ]
  );

  console.log(
    "%c [  ]-24",
    "font-size:13px; background:pink; color:#bf2c9f;",
    optimisticMessages
  );
  return (
    <>
      {optimisticMessages.map((message, index) => (
        <div key={index}>
          {message.text}
          {!!message.sending && <small> (Sending...)</small>}
        </div>
      ))}
      <form action={formAction} ref={formRef}>
        <input type="text" name="message" placeholder="Hello!" />
        <button type="submit">Send</button>
      </form>
    </>
  );
}

export default function UseOptimisticPage() {
  const [errorMsg, setErrorMsg] = useState("");
  const [messages, setMessages] = useState([
    { text: "Hello there!", sending: false, key: 0 },
  ]);
  async function sendMessage(formData) {
    const msg = formData.get("message");
    const res = await updateSomething({ msg });
    if (res.error) {
      setErrorMsg(msg + "-" + res.error.msg);
    } else {
      setErrorMsg("");
      setMessages((messages) => [
        ...messages,
        { text: res.msg, key: messages.length },
      ]);
    }
  }

  return (
    <div>
      <h3>UseOptimisticPage</h3>
      <Thread messages={messages} sendMessage={sendMessage} />
      <p className="red">{errorMsg}</p>
    </div>
  );
}
