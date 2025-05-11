import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { updateSomething } from "../utils";

export default function UseFormStatusPage() {
  const [user, submitAction, isPending] = useActionState(
    async (previousState, formData) => {
      const res = await updateSomething({
        user: formData.get("name"),
        userId: 1,
      });
      return res.user;
    },
    null
  );

  return (
    <div>
      <h3>UseFormStatusPage</h3>
      <form action={submitAction}>
        <input type="text" name="name" autoComplete="off" />
        <button type="submit" disabled={isPending}>
          {isPending ? "DesignButton Updating..." : "DesignButton Update"}
        </button>

        <DesignButton />
      </form>
      <p>userName: {user}</p>
      {/* 注意下面这个 DesignButton 不能通过 useFormStatus 获取pending，因为它不在form内 */}
      {/* <DesignButton>{isPending ? "2Updating.." : "2Update"}</DesignButton> */}
    </div>
  );
}

function DesignButton() {
  const status = useFormStatus();
  console.log(
    "%c [ pending ]-41",
    "font-size:13px; background:pink; color:#bf2c9f;",
    status,
    status.data?.get("name")
  );
  return (
    <>
      <p>分割线</p>
      <button
        disabled={status.pending}
        onClick={() => {
          typeof status.action === "function" && status.action();
        }}
      >
        test{status.pending ? "ing..." : ""}
      </button>
    </>
  );
}
