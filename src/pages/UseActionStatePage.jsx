import { useActionState } from "react";
import { fetchUser2 } from "../utils";

export default function UseActionStatePage() {
  const [user, submitAction, isPending] = useActionState(
    async (previousState, formData) => {
      console.log(formData?.get("name")); //sy-log
      const user = await fetchUser2(formData?.get("name"));
      return user;
    },
    "initial value" // state
  );

  // ? 在点击update 1次之后，猜猜这里log几次
  console.log("user", user); //sy-log

  return (
    <div>
      <h3>UseActionStatePage</h3>
      <form action={submitAction}>
        <input type="text" name="name" autoComplete="off" />
        <button type="submit" disabled={isPending}>
          {isPending ? "Updating.." : "Update"}
        </button>
      </form>

      <p>userName: {user}</p>
    </div>
  );
}
