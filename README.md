安装： npm install
启动： npm start

如果重新 clone react，有以下三个文件需要更改：

1. /src/react/packages/react-reconciler/src/ReactFiberHostConfig.js

```jsx
//invariant(false, 'This module must be shimmed by a specific renderer.'); //sy
export * from "./forks/ReactFiberHostConfig.dom";
```

2. /src/react/packages/shared/invariant.js

```jsx
export default function invariant(condition, format, a, b, c, d, e, f) {
  if (condition) return; //加上这个
  throw new Error(
    "Internal React error: invariant() is meant to be replaced at compile " +
      "time. There is no runtime version."
  );
}
```

3. /src/react/packages/shared/ReactSharedInternals.js

```jsx
// import React from 'react';
// const ReactSharedInternals =
//   React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;

import ReactSharedInternals from "../react/src/ReactSharedInternals";
```

参考：
https://github.com/nannongrousong/blog/issues/1
https://github.com/bubucuo/react-sourcecode-debug-env
