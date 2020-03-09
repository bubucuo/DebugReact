/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

/**
 * This is a renderer of React that doesn't have a render target output.
 * It is useful to demonstrate the internals of the reconciler in isolation
 * and for testing semantics of reconciliation separate from the host
 * environment.
 * 这是React的一个没有渲染目标输出的渲染器。
 * 这对于强调协调器的内部构件的独立性、以及测试协调与主环境的独立性是有用的，
 */

import ReactFiberReconciler from "react-reconciler";
import createReactNoop from "./createReactNoop";

const ReactNoop = createReactNoop(
  ReactFiberReconciler, // reconciler
  true // useMutation
);

export default ReactNoop;
