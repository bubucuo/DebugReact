import { useOptimistic, useState } from "react";
import { updateSomething } from "../utils";

// useOptimistic hook, 升级版的useReducer，可以处理乐观更新
// hooks： 单链表 hook1(next) -> hook2 -> hook3 -> hook4
function Thread({ messages, sendMessage }) {
  async function formAction(formData) {
    addOptimisticMessage(formData.get("message"));
    await sendMessage(formData);
  }
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage) => {
      return [
        ...state,
        {
          text: newMessage,
          sending: true,
        },
      ];
    }
  );

  console.log(
    "%c [  ]-24",
    "font-size:13px; background:pink; color:#bf2c9f;",
    optimisticMessages
  );
  return (
    <>
      {/* 正常更新（不考虑乐观） */}
      {/* {messages.map((message, index) => (
        <div key={index}>
          {message.text}
          {!!message.sending && <small> (Sending...)</small>}
        </div>
      ))} */}
      {/* 乐观更新 */}
      {optimisticMessages.map((message, index) => (
        <div key={index} className="border">
          {message.text}
          {!!message.sending && <small> (Sending...)</small>}
        </div>
      ))}
      <form action={formAction}>
        <input
          type="text"
          name="message"
          placeholder="Hello!"
          autoComplete="off"
        />
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
