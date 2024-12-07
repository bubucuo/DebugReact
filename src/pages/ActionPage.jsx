import { useState, useTransition } from "react";

export default function ActionPage() {
  const [user, setUser] = useState("");
  const [isPending, startTransition] = useTransition(); // 过渡更新

  const handleSubmit = () => {
    startTransition(async () => {
      const res = await fetch("https://randomuser.me/api")
        .then((x) => x.json())
        .then((x) => x.results[0]);
      setUser(res.name.first);
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
