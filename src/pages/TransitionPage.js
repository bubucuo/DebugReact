import { useEffect, useState, Suspense } from "react";
import Button from "../components/Button";
import User from "../components/User";
import Num from "../components/Num";
import { fetchData } from "../utils";

const initialResource = fetchData();

export default function TransitionPage(props) {
  const [resource, setResource] = useState(initialResource);

  return (
    <div>
      <h3>TransitionPage</h3>
      <Suspense fallback={<h1>loading - user</h1>}>
        <User resource={resource} />
      </Suspense>

      <Suspense fallback={<h1>loading-num</h1>}>
        <Num resource={resource} />
      </Suspense>

      <Button
        refresh={() => {
          setResource(fetchData());
        }}
      />
    </div>
  );
}
