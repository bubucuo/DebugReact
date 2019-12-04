/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import warningWithoutStack from "shared/warningWithoutStack";
import ReactSharedInternals from "shared/ReactSharedInternals";

/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */
/* React 源码采用 warning 模块展示警告 */

/* 警告会在 warning 的条件为 false 时出现。
  warning 机制可以理解为，当编写判定条件的时候，应当使用符合正常逻辑的条件判断，这样出现异常
  的时候就会触发 warning，注意判定条件不要用反了。
我们应当注意避免大量打印重复的 warning： */

/* warning 仅在开发环境中启用。在生产环境中，他们会被完全剔除掉。如果你需要在生产环境禁止执行
某些代码，请使用 invariant 模块代替 warning： */
let warning = warningWithoutStack;

if (__DEV__) {
  warning = function(condition, format, ...args) {
    if (condition) {
      return;
    }
    const ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
    const stack = ReactDebugCurrentFrame.getStackAddendum();
    // eslint-disable-next-line react-internal/warning-and-invariant-args
    warningWithoutStack(false, format + "%s", ...args, stack);
  };
}

export default warning;
