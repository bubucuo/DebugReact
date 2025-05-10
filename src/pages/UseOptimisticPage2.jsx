import { useActionState, useOptimistic } from "react";
import { fetchUser2 } from "../utils";

export default function UseOptimisticPage2() {
  const [user, submitAction, isPending] = useActionState(
    async (previousState, formData) => {
      const name = formData?.get("name");
      const user = await fetchUser2(name);
      return user;
    },
    "initial value"
  );

  const [optimisticUser, setOptimisticUser] = useOptimistic(
    user,
    (currentState, optimisticValue) => {
      return optimisticValue;
    }
  );

  const handleSubmit = (formaData) => {
    const name = formaData.get("name");
    setOptimisticUser(name);
    submitAction(formaData);
  };

  return (
    <div>
      <h3>UseOptimisticPage2</h3>
      <form action={handleSubmit}>
        <input type="text" name="name" autoComplete="off" />
        <button type="submit" disabled={isPending}>
          {isPending ? "Updating..." : "Update"}
        </button>
      </form>

      <p>user (final): {user}</p>
      <p>optimisticUser: {optimisticUser}</p>
    </div>
  );
}
