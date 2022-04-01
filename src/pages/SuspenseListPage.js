import { useState, Suspense, SuspenseList } from "react";
import User from "../components/User";
import Num from "../components/Num";
import { fetchData } from "../utils";
import ErrorBoundaryPage from "./ErrorBoundaryPage";

const initialResource = fetchData();

export default function SuspenseListPage(props) {
  const [resource, setResource] = useState(initialResource);

  return (
    <div>
      <h3>SuspenseListPage</h3>
      <SuspenseList revealOrder="forwards" tail="collapsed">
        <Suspense fallback={<h1>loading-num</h1>}>
          <Num resource={resource} />
        </Suspense>

        <ErrorBoundaryPage fallback={<h1>网络出错了</h1>}>
          <Suspense fallback={<h1>loading - user</h1>}>
            <User resource={resource} />
          </Suspense>
        </ErrorBoundaryPage>
      </SuspenseList>

      <button onClick={() => setResource(fetchData())}>refresh</button>
    </div>
  );
}
