import { useActionState, useState } from "react";

export default function UseActionStatePage() {
  const [user, setUser] = useState("");
  const [error, submitAction, isPending] = useActionState(
    async (previousState, formData) => {
      console.log(formData.get("name")); //sy-log
      const res = await fetch("https://randomuser.me/api")
        .then((x) => x.json())
        .then((x) => x.results[0]);
      setUser(res.name.first);
      // window.location.href = "https://www.baidu.com";
    },
    null
  );

  return (
    <div>
      <h3>UseActionStatePage</h3>
      <form action={submitAction}>
        <input type="text" name="name" />
        <button type="submit" disabled={isPending}>
          {isPending ? "Updating.." : "Update"}
        </button>
        {error && <p>{error}</p>}
      </form>
      <p>userName: {user}</p>
    </div>
  );
}
