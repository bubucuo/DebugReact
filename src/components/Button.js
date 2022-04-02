import {
  // startTransition
  useTransition,
} from "../whichReact";

export default function Button({ refresh }) {
  const [isPending, startTransition] = useTransition();
  return (
    <div>
      <h3>Button</h3>
      <button
        disabled={isPending}
        onClick={() => {
          startTransition(refresh);
        }}
      >
        refresh
      </button>
      <p>{isPending ? "loading" : ""}</p>
    </div>
  );
}
