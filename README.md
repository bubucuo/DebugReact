源码文件指引地址：https://www.processon.com/view/link/5dd68342e4b001fa2e0c4697

##说明
本项目用于调试源码，即修改配置使得项目中引用的 react 包来自 src/react，使得我们可以在 src/react 下 debug 和打 log 调试。

##使用步骤

1. 在根目录下安装： npm install
2. 下载react包到src下，并按照下面的修改配置步骤修改react中的文件。
3. 在根目录下启动： npm start



### 修改配置

src 下有个 CONST 配置文件，可以运行源码的 src/react 或者是运行学习使用的 kreact，自己选择就行了。

如果报错找不到 CONST 文件，看下你本地的文件名是 const 还是 CONST，保证代码中的引入文件名和本地文件名一致。

**注意：另外，这个修改配置规则用的react包是2021.03.09日下载的，后面版本更新了，可能修改配置还得跟着改。**

### 修改 react 包

**最新的react包可以忽略第5条修改了。**

如果想要自己重新 clone react，有以下一些文件需要更改：

1. /src/react/packages/react-reconciler/src/ReactFiberHostConfig.js

```jsx
// import invariant from 'shared/invariant';
//invariant(false, 'This module must be shimmed by a specific renderer.'); //sy
// sy
export * from "./forks/ReactFiberHostConfig.dom";
```

2. /src/react/packages/shared/invariant.js

```jsx
export default function invariant(condition, format, a, b, c, d, e, f) {
  if (condition) return; // sy 加上这个

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

// sy
import ReactSharedInternals from "../react/src/ReactSharedInternals";
```

4. /src/react/packages/scheduler/index.js

   ```jsx
   "use strict";

   export * from "./src/Scheduler";
   // sy 添加以下
   export {
     unstable_flushAllWithoutAsserting,
     unstable_flushNumberOfYields,
     unstable_flushExpired,
     unstable_clearYields,
     unstable_flushUntilNextPaint,
     unstable_flushAll,
     unstable_yieldValue,
     unstable_advanceTime,
   } from "./src/SchedulerHostConfig.js";
   ```

5. react/packages/scheduler/src/SchedulerHostConfig.js

   **这条不适用于react17.0.2**。

```js
// 注释掉这里
// throw new Error('This module must be shimmed by a specific build.');

// 添加以下
export {
  unstable_flushAllWithoutAsserting,
  unstable_flushNumberOfYields,
  unstable_flushExpired,
  unstable_clearYields,
  unstable_flushUntilNextPaint,
  unstable_flushAll,
  unstable_yieldValue,
  unstable_advanceTime,
} from "./forks/SchedulerHostConfig.mock.js";

export {
  requestHostCallback,
  requestHostTimeout,
  cancelHostTimeout,
  shouldYieldToHost,
  getCurrentTime,
  forceFrameRate,
  requestPaint,
} from "./forks/SchedulerHostConfig.default.js";
```



6. react/.eslintrc.js

   1）搜索  extends: ['fbjs', 'prettier']，把这个数组置空。

   2）搜索no-function-declare-after-return和react-internal，把相关的代码行全部注释掉。

   我修改后的文件如下：

```js
'use strict';

const {
  es5Paths,
  esNextPaths,
} = require('./scripts/shared/pathsByLanguageVersion');

const restrictedGlobals = require('confusing-browser-globals');

const OFF = 0;
const ERROR = 2;

module.exports = {
  extends: [], // sy ['fbjs', 'prettier'],

  // Stop ESLint from looking for a configuration file in parent folders
  root: true,

  plugins: [
    'jest',
    'no-for-of-loops',
    // 'no-function-declare-after-return',
    'react',
    // 'react-internal',
  ],

  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 8,
    sourceType: 'script',
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
    },
  },

  // We're stricter than the default config, mostly. We'll override a few rules
  // and then enable some React specific ones.
  rules: {
    'accessor-pairs': OFF,
    'brace-style': [ERROR, '1tbs'],
    'consistent-return': OFF,
    'dot-location': [ERROR, 'property'],
    // We use console['error']() as a signal to not transform it:
    'dot-notation': [ERROR, {allowPattern: '^(error|warn)$'}],
    'eol-last': ERROR,
    eqeqeq: [ERROR, 'allow-null'],
    indent: OFF,
    'jsx-quotes': [ERROR, 'prefer-double'],
    'keyword-spacing': [ERROR, {after: true, before: true}],
    'no-bitwise': OFF,
    'no-console': OFF,
    'no-inner-declarations': [ERROR, 'functions'],
    'no-multi-spaces': ERROR,
    'no-restricted-globals': [ERROR].concat(restrictedGlobals),
    'no-restricted-syntax': [ERROR, 'WithStatement'],
    'no-shadow': ERROR,
    'no-unused-expressions': ERROR,
    'no-unused-vars': [ERROR, {args: 'none'}],
    'no-use-before-define': OFF,
    'no-useless-concat': OFF,
    quotes: [ERROR, 'single', {avoidEscape: true, allowTemplateLiterals: true}],
    'space-before-blocks': ERROR,
    'space-before-function-paren': OFF,
    'valid-typeof': [ERROR, {requireStringLiterals: true}],
    // Flow fails with with non-string literal keys
    'no-useless-computed-key': OFF,

    // We apply these settings to files that should run on Node.
    // They can't use JSX or ES6 modules, and must be in strict mode.
    // They can, however, use other ES6 features.
    // (Note these rules are overridden later for source files.)
    'no-var': ERROR,
    strict: ERROR,

    // Enforced by Prettier
    // TODO: Prettier doesn't handle long strings or long comments. Not a big
    // deal. But I turned it off because loading the plugin causes some obscure
    // syntax error and it didn't seem worth investigating.
    'max-len': OFF,
    // Prettier forces semicolons in a few places
    'flowtype/object-type-delimiter': OFF,

    // React & JSX
    // Our transforms set this automatically
    'react/jsx-boolean-value': [ERROR, 'always'],
    'react/jsx-no-undef': ERROR,
    // We don't care to do this
    'react/jsx-sort-prop-types': OFF,
    'react/jsx-space-before-closing': ERROR,
    'react/jsx-uses-react': ERROR,
    'react/no-is-mounted': OFF,
    // This isn't useful in our test code
    'react/react-in-jsx-scope': ERROR,
    'react/self-closing-comp': ERROR,
    // We don't care to do this
    'react/jsx-wrap-multilines': [
      ERROR,
      {declaration: false, assignment: false},
    ],

    // Prevent for...of loops because they require a Symbol polyfill.
    // You can disable this rule for code that isn't shipped (e.g. build scripts and tests).
    'no-for-of-loops/no-for-of-loops': ERROR,

    // sy
    // Prevent function declarations after return statements
    // 'no-function-declare-after-return/no-function-declare-after-return': ERROR, // sy

    // CUSTOM RULES
    // the second argument of warning/invariant should be a literal string
    // 'react-internal/no-primitive-constructors': ERROR,
    // 'react-internal/no-to-warn-dev-within-to-throw': ERROR,
    // 'react-internal/invariant-args': ERROR,
    // 'react-internal/warning-args': ERROR,
    // 'react-internal/no-production-logging': ERROR,
    // 'react-internal/no-cross-fork-imports': ERROR,
    // 'react-internal/no-cross-fork-types': [
    //   ERROR,
    //   {
    //     old: [],
    //     new: [],
    //   },
    // ],
  },

  overrides: [
    {
      // We apply these settings to files that we ship through npm.
      // They must be ES5.
      files: es5Paths,
      parser: 'espree',
      parserOptions: {
        ecmaVersion: 5,
        sourceType: 'script',
      },
      rules: {
        'no-var': OFF,
        strict: ERROR,
      },
    },
    {
      // We apply these settings to the source files that get compiled.
      // They can use all features including JSX (but shouldn't use `var`).
      files: esNextPaths,
      parser: 'babel-eslint',
      parserOptions: {
        ecmaVersion: 8,
        sourceType: 'module',
      },
      rules: {
        'no-var': ERROR,
        'prefer-const': ERROR,
        strict: OFF,
      },
    },
    {
      files: ['**/__tests__/*.js'],
      rules: {
        // https://github.com/jest-community/eslint-plugin-jest
        'jest/no-focused-tests': ERROR,
        'jest/valid-expect': ERROR,
        'jest/valid-expect-in-promise': ERROR,
      },
    },
    {
      files: [
        '**/__tests__/**/*.js',
        'scripts/**/*.js',
        'packages/*/npm/**/*.js',
        'packages/dom-event-testing-library/**/*.js',
        'packages/react-devtools*/**/*.js',
      ],
      rules: {
        'react-internal/no-production-logging': OFF,
        'react-internal/warning-args': OFF,

        // Disable accessibility checks
        'jsx-a11y/aria-role': OFF,
        'jsx-a11y/no-noninteractive-element-interactions': OFF,
        'jsx-a11y/no-static-element-interactions': OFF,
        'jsx-a11y/role-has-required-aria-props': OFF,
        'jsx-a11y/no-noninteractive-tabindex': OFF,
        'jsx-a11y/tabindex-no-positive': OFF,
      },
    },
    {
      files: [
        'packages/react-native-renderer/**/*.js',
        'packages/react-server-native-relay/**/*.js',
      ],
      globals: {
        nativeFabricUIManager: true,
      },
    },
    {
      files: ['packages/react-server-dom-webpack/**/*.js'],
      globals: {
        __webpack_chunk_load__: true,
        __webpack_require__: true,
      },
    },
    {
      files: ['packages/scheduler/**/*.js'],
      globals: {
        TaskController: true,
      },
    },
  ],

  globals: {
    SharedArrayBuffer: true,

    spyOnDev: true,
    spyOnDevAndProd: true,
    spyOnProd: true,
    __EXPERIMENTAL__: true,
    __EXTENSION__: true,
    __PROFILE__: true,
    __TEST__: true,
    __UMD__: true,
    __VARIANT__: true,
    gate: true,
    trustedTypes: true,
  },
};
```



7. 在react/packages下全局搜索react-internal，把包含react-internal的注释行全部删掉。

8. 在react/packages/react-dom/src/client下新建sy.js文件，如下:

   ```js
   /**
    * Copyright (c) Facebook, Inc. and its affiliates.
    *
    * This source code is licensed under the MIT license found in the
    * LICENSE file in the root directory of this source tree.
    *
    * @flow
    */
   
   export const isPrimaryRenderer = true;
   export const warnsIfNotActing = true;
   // This initialization code may run even on server environments
   // if a component just imports ReactDOM (e.g. for findDOMNode).
   // Some environments might not have setTimeout or clearTimeout.
   export const scheduleTimeout: any =
     typeof setTimeout === 'function' ? setTimeout : (undefined: any);
   export const cancelTimeout: any =
     typeof clearTimeout === 'function' ? clearTimeout : (undefined: any);
   export const noTimeout = -1;
   
   // -------------------
   //     Microtasks
   // -------------------
   export const supportsMicrotasks = true;
   export const scheduleMicrotask: any =
     typeof queueMicrotask === 'function'
       ? queueMicrotask
       : typeof Promise !== 'undefined'
       ? callback =>
           Promise.resolve(null)
             .then(callback)
             .catch(handleErrorInNextTick)
       : scheduleTimeout; // TODO: Determine the best fallback here.
   
   function handleErrorInNextTick(error) {
     setTimeout(() => {
       throw error;
     });
   }
   
   export const supportsMutation = true;
   export const supportsHydration = true;
   export const supportsTestSelectors = true;
   ```

9. 把sy.js定义的常量，在react/packages/react-dom/src/client/ReactDOMHostConfig.js文件中全部找到并注释，并在ReactDOMHostConfig.js结尾加上`export * from './sy';`。如

   ![image-20210311191542373](https://tva1.sinaimg.cn/large/008eGmZEly1gog6j7pvwmj30u00yi4qp.jpg)

![image-20210311191619315](https://tva1.sinaimg.cn/large/008eGmZEly1gog6jumocwj31160kswqd.jpg)