/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

/* 当 invariant 判别条件为 false 时，会将 invariant 的信息作为错误抛出

“Invariant” 用于声明 “这个条件应总为 true”。你可以把它当成一种断言。
保持开发和生产环境的行为相似是十分重要的，因此 invariant 在开发和生产环境下都会抛出错误。
不同点在于在生产环境中这些错误信息会被自动替换成错误代码，这样可以让输出库文件变得更小。
 */

export default function invariant(condition, format, a, b, c, d, e, f) {
  if (condition) return; //加上这个
  throw new Error(
    "Internal React error: invariant() is meant to be replaced at compile " +
      "time. There is no runtime version."
  );
}
