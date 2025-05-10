import { useState, useTransition } from "react";
import { fetchUser } from "../utils";
// import { startTransition } from "react";

export default function ActionPage() {
  const [user, setUser] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    startTransition(async () => {
      const user = await fetchUser();
      setUser(user.name.first);
    });
  };

  return (
    <div>
      <h3>ActionPage</h3>
      <p>userName: {user}</p>
      <button onClick={handleSubmit} disabled={isPending}>
        {isPending ? "Updating.." : "Update"}
      </button>
    </div>
  );
}
