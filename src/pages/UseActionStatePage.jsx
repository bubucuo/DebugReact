import { useActionState } from "react";
import { fetchUser2 } from "../utils";

export default function UseActionStatePage() {
  // const [user, setUser] = useState("");
  const [user, submitAction, isPending] = useActionState(
    async (previousState, formData) => {
      console.log(formData?.get("name")); //sy-log
      const res = await fetchUser2(formData?.get("name"));
      return res;
    },
    "initial value", // state
    "https://github.com/bubucuo"
  );
  // ? 在点击update 1次之后，猜猜这里log几次
  console.log("user", user); //sy-log

  return (
    <div>
      <h3>UseActionStatePage</h3>
      <form action={submitAction}>
        <input type="text" name="name" />
        <button type="submit" disabled={isPending}>
          {isPending ? "Updating.." : "Update"}
        </button>
      </form>
      <p>userName: {user}</p>
    </div>
  );
}
