import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

export default function UseFormStatusPage() {
  const [user, setUser] = useState("default");
  const [error, submitAction, isPending] = useActionState(
    async (previousState, formData) => {
      const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        body: JSON.stringify({
          user: formData.get("name"),
          userId: 1,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }).then((response) => response.json());
      setUser(res.user);
    },
    null
  );

  return (
    <div>
      <h3>UseFormStatusPage</h3>
      <form action={submitAction}>
        <input type="text" name="name" />
        <DesignButton>
          {isPending ? "DesignButton Updating.." : "DesignButton Update"}
        </DesignButton>
        {error && <p>{error}</p>}
      </form>
      <p>userName: {user}</p>
      {/* 注意下面这个 DesignButton 不能通过 useFormStatus 获取pending，因为它不在form内 */}
      {/* <DesignButton>{isPending ? "2Updating.." : "2Update"}</DesignButton> */}
    </div>
  );
}

function DesignButton(props) {
  const status = useFormStatus();
  console.log(
    "%c [ pending ]-41",
    "font-size:13px; background:pink; color:#bf2c9f;",
    status,
    status.data?.get("name")
  );
  return (
    <>
      <button type="submit" disabled={status.pending} {...props} />
      <p>分割线</p>
      <button
        disabled={status.pending}
        {...props}
        onClick={() => {
          // omg
          console.log(
            "%c [  ]-49",
            "font-size:13px; background:pink; color:#bf2c9f;",
            status
          );
          typeof status.action === "function" && status.action();
        }}
      >
        test
      </button>
    </>
  );
}
