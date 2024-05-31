import User from "../components/User";
import Num from "../components/Num";
import { fetchData } from "../utils";
import {
  Suspense,
  useState,
  useTransition,
  // startTransition
} from "react";

const initialResource = fetchData();

export default function TransitionPage(props) {
  const [resource, setResource] = useState(initialResource);
  const [isPending, startTransition] = useTransition();

  const refresh = () => {
    startTransition(() => {
      setResource(fetchData());
    });
  };
  return (
    <div>
      <h3>TransitionPage</h3>
      <Suspense fallback={<h1>Loading user..</h1>}>
        <User resource={resource} />
      </Suspense>
      <Suspense fallback={<h1>Loading num..</h1>}>
        <Num resource={resource} />
      </Suspense>

      <button onClick={refresh}>{isPending ? "loading..." : "refresh"}</button>
      {/* <button onClick={refresh}>refresh</button> */}
    </div>
  );
}
