import { useState, useTransition, useActionState, useOptimistic } from "react";
import { useFormStatus } from "react-dom";

function getData(formData) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (formData.get("incrementAmount") === "error") {
        resolve("请输入数字");
      } else {
        resolve(null);
      }
    }, 500);
  });
}

const initialState = { count: 0, error: "" };

export default function ActionPage({}) {
  const [state, submitAction, isPending] = useActionState(
    async (previousState, formData) => {
      const error = await getData(formData);
      if (error) {
        return { error, count: previousState.count };
      }
      return {
        error: "",
        count:
          previousState.count + parseInt(formData.get("incrementAmount"), 10),
      };
    },
    initialState
  );

  return (
    <div>
      <h3>ActionPage</h3>
      <form className="border" action={submitAction}>
        <span>Count: {state.count}</span>
        <input type="text" name="incrementAmount" defaultValue="5" />
        <p className="red">{state.error}</p>
        <button type="submit" disabled={isPending}>
          Update {isPending && "..."}
        </button>
        <DesignButton />
      </form>
    </div>
  );
}

function DesignButton() {
  const status = useFormStatus();
  console.log("status", status); //sy-log
  return <button disabled={true}>DesignButton{status.pending && "..."}</button>;
}
