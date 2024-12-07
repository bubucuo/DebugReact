import { useRef, useState, useOptimistic } from "react";

function getData(num) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (num === "error" || isNaN(num)) {
        resolve("请输入数字");
      } else {
        resolve(null);
      }
    }, 500);
  });
}

export default function UseOptimisticPage() {
  const formRef = useRef();
  const [state, setState] = useState({ count: 0, sending: false, error: "" });

  async function sendMessage(num) {
    const error = await getData(num);
    if (error) {
      setState((messages) => ({
        error,
        count: messages.count,
      }));
    } else
      setState((messages) => ({
        error: "",
        count: messages.count + num,
      }));
  }

  const [optimisticState, addOptimistic] = useOptimistic(
    state,
    (previousState, newCount) => {
      return {
        sending: true,
        error: "",
        count: previousState.count + newCount,
      };
    }
  );

  async function submitAction(formData) {
    const num = parseInt(formData.get("incrementAmount"), 10);
    addOptimistic(num);
    // formRef.current.reset();
    await sendMessage(num);
  }

  console.log(
    "%c [  ]-60",
    "font-size:13px; background:pink; color:#bf2c9f;",
    optimisticState
  );

  return (
    <div>
      <h3>UseOptimisticPage</h3>
      <form className="border" action={submitAction} ref={formRef}>
        <span>Count: {optimisticState.count}</span>
        <input type="text" name="incrementAmount" defaultValue="5" />
        <p className="red">{state.error}</p>
        <button type="submit" disabled={optimisticState.sending}>
          optimisticState Update {optimisticState.sending && "..."}
        </button>
      </form>
    </div>
  );
}
