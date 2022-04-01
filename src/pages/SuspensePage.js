import { useState, Suspense } from "../whichReact";
import User from "../components/User";
import Num from "../components/Num";
import { fetchData } from "../utils";
import ErrorBoundaryPage from "./ErrorBoundaryPage";

const initialResource = fetchData();

export default function SuspensePage(props) {
  const [resource, setResource] = useState(initialResource);

  return (
    <div>
      <h3>SuspensePage</h3>

      <ErrorBoundaryPage fallback={<h1>网络出错了</h1>}>
        <Suspense fallback={<h1>loading - user</h1>}>
          <User resource={resource} />
        </Suspense>
      </ErrorBoundaryPage>

      <Suspense fallback={<h1>loading - num</h1>}>
        <Num resource={resource} />
      </Suspense>

      <button onClick={() => setResource(fetchData())}>refresh</button>
    </div>
  );
}

// 1. 先渲染组件
// 2. 显示loading
// 2. 在useEffect或者cdm发起服务端请求
// 3.0 隐藏loading
// 3. 拿到服务端请求之后再渲染组件
