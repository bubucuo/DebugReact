

# React 源码学习指南

关注公众号：bubucuo，回复 debug，就能拿到DebugReact压缩包。

## 前言

本项目用于调试源码，即修改配置使得项目中引用的 react 包来自 src/react，使得我们可以在 src/react 下 debug 和打 log 调试。

## 资源

1. [源码文件指引地址]([React 源码文件指引 | ProcessOn 免费在线作图,在线流程图,在线思维导图](https://www.processon.com/view/link/60b206c2e0b34d3841931a88))

## 使用步骤

1. 在根目录下安装： yarn add
2. 下载 react 包到 src 下，并按照下面的修改配置步骤修改 react 中的文件。
3. 在根目录下启动： yarn start

## 自己从 github 下载 react 包并修改配置

1. /src/react/packages/react-reconciler/src/ReactFiberHostConfig.js

```jsx
// throw new Error('This module must be shimmed by a specific renderer.');
// sy
export * from "./forks/ReactFiberHostConfig.dom";
```

2. /src/react/packages/shared/ReactSharedInternals.js

```jsx
// import React from 'react';
// const ReactSharedInternals =
//   React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;

// sy
import ReactSharedInternals from "../react/src/ReactSharedInternals";
```

3. /src/react/packages/scheduler/index.js

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
  unstable_setDisableYieldValue,
} from "./src/forks/SchedulerMock";
```

4. react/.eslintrc.js

1）搜索 extends: ['fbjs', 'prettier']，把这个数组置空。

2）搜索 *no-for-of-loops/no-for-of-loops、no-function-declare-after-return 和 react-internal，把相关的代码行全部注释掉。

3）搜索 eol-last，把` 'eol-last': ERROR,`的 ERROR 改为 OFF

4）搜索 quotes，把 quotes 和 jsx-quotes 的值也修改为 OFF

5）搜索 no-unused-vars 和 no-var，把值改为 OFF

我修改后的文件如下：

```js
"use strict";

const {
  es5Paths,
  esNextPaths,
} = require("./scripts/shared/pathsByLanguageVersion");

const restrictedGlobals = require("confusing-browser-globals");

const OFF = 0;
const ERROR = 2;

module.exports = {
  extends: [],

  // Stop ESLint from looking for a configuration file in parent folders
  root: true,

  plugins: ["jest", "no-for-of-loops", "react"],

  parser: "babel-eslint",
  parserOptions: {
    ecmaVersion: 9,
    sourceType: "script",
  },

  // We're stricter than the default config, mostly. We'll override a few rules
  // and then enable some React specific ones.
  rules: {
    "accessor-pairs": OFF,
    "brace-style": [ERROR, "1tbs"],
    "consistent-return": OFF,
    "dot-location": [ERROR, "property"],
    // We use console['error']() as a signal to not transform it:
    "dot-notation": [ERROR, { allowPattern: "^(error|warn)$" }],
    "eol-last": OFF,
    eqeqeq: [ERROR, "allow-null"],
    indent: OFF,
    "jsx-quotes": OFF,
    "keyword-spacing": [ERROR, { after: true, before: true }],
    "no-bitwise": OFF,
    "no-console": OFF,
    "no-inner-declarations": [ERROR, "functions"],
    "no-multi-spaces": ERROR,
    "no-restricted-globals": [ERROR].concat(restrictedGlobals),
    "no-restricted-syntax": [ERROR, "WithStatement"],
    "no-shadow": ERROR,
    "no-unused-expressions": ERROR,
    "no-unused-vars": OFF, //[ERROR, {args: 'none'}],
    "no-use-before-define": OFF,
    "no-useless-concat": OFF,
    quotes: OFF,
    "space-before-blocks": ERROR,
    "space-before-function-paren": OFF,
    "valid-typeof": [ERROR, { requireStringLiterals: true }],
    // Flow fails with with non-string literal keys
    "no-useless-computed-key": OFF,

    // We apply these settings to files that should run on Node.
    // They can't use JSX or ES6 modules, and must be in strict mode.
    // They can, however, use other ES6 features.
    // (Note these rules are overridden later for source files.)
    "no-var": OFF,
    strict: ERROR,

    // Enforced by Prettier
    // TODO: Prettier doesn't handle long strings or long comments. Not a big
    // deal. But I turned it off because loading the plugin causes some obscure
    // syntax error and it didn't seem worth investigating.
    "max-len": OFF,
    // Prettier forces semicolons in a few places
    "flowtype/object-type-delimiter": OFF,

    // React & JSX
    // Our transforms set this automatically
    "react/jsx-boolean-value": [ERROR, "always"],
    "react/jsx-no-undef": ERROR,
    // We don't care to do this
    "react/jsx-sort-prop-types": OFF,
    "react/jsx-space-before-closing": ERROR,
    "react/jsx-uses-react": ERROR,
    "react/no-is-mounted": OFF,
    // This isn't useful in our test code
    "react/react-in-jsx-scope": ERROR,
    "react/self-closing-comp": ERROR,
    // We don't care to do this
    "react/jsx-wrap-multilines": [
      ERROR,
      { declaration: false, assignment: false },
    ],

    // Prevent for...of loops because they require a Symbol polyfill.
    // You can disable this rule for code that isn't shipped (e.g. build scripts and tests).
    "no-for-of-loops/no-for-of-loops": ERROR,
  },

  overrides: [
    {
      // By default, anything error message that appears the packages directory
      // must have a corresponding error code. The exceptions are defined
      // in the next override entry.
      files: ["packages/**/*.js"],
    },
    {
      // These are files where it's OK to have unminified error messages. These
      // are environments where bundle size isn't a concern, like tests
      // or Node.
      files: [
        "packages/react-dom/src/test-utils/**/*.js",
        "packages/react-devtools-shared/**/*.js",
        "packages/react-noop-renderer/**/*.js",
        "packages/react-pg/**/*.js",
        "packages/react-fs/**/*.js",
        "packages/react-refresh/**/*.js",
        "packages/react-server-dom-webpack/**/*.js",
        "packages/react-test-renderer/**/*.js",
        "packages/react-debug-tools/**/*.js",
        "packages/react-devtools-extensions/**/*.js",
        "packages/react-devtools-timeline/**/*.js",
        "packages/react-native-renderer/**/*.js",
        "packages/eslint-plugin-react-hooks/**/*.js",
        "packages/jest-react/**/*.js",
        "packages/**/__tests__/*.js",
        "packages/**/npm/*.js",
      ],
    },
    {
      // We apply these settings to files that we ship through npm.
      // They must be ES5.
      files: es5Paths,
      parser: "espree",
      parserOptions: {
        ecmaVersion: 5,
        sourceType: "script",
      },
      rules: {
        "no-var": OFF,
        strict: ERROR,
      },
    },
    {
      // We apply these settings to the source files that get compiled.
      // They can use all features including JSX (but shouldn't use `var`).
      files: esNextPaths,
      parser: "babel-eslint",
      parserOptions: {
        ecmaVersion: 8,
        sourceType: "module",
      },
      rules: {
        "no-var": OFF,
        "prefer-const": ERROR,
        strict: OFF,
      },
    },
    {
      files: ["**/__tests__/*.js"],
      rules: {
        // https://github.com/jest-community/eslint-plugin-jest
        "jest/no-focused-tests": ERROR,
        "jest/valid-expect": ERROR,
        "jest/valid-expect-in-promise": ERROR,
      },
    },
    {
      files: [
        "**/__tests__/**/*.js",
        "scripts/**/*.js",
        "packages/*/npm/**/*.js",
        "packages/dom-event-testing-library/**/*.js",
        "packages/react-devtools*/**/*.js",
        "dangerfile.js",
        "fixtures",
        "packages/react-dom/src/test-utils/*.js",
      ],
      rules: {
        // Disable accessibility checks
        "jsx-a11y/aria-role": OFF,
        "jsx-a11y/no-noninteractive-element-interactions": OFF,
        "jsx-a11y/no-static-element-interactions": OFF,
        "jsx-a11y/role-has-required-aria-props": OFF,
        "jsx-a11y/no-noninteractive-tabindex": OFF,
        "jsx-a11y/tabindex-no-positive": OFF,
      },
    },
    {
      files: [
        "scripts/eslint-rules/*.js",
        "packages/eslint-plugin-react-hooks/src/*.js",
      ],
      plugins: ["eslint-plugin"],
      rules: {
        "eslint-plugin/prefer-object-rule": ERROR,
        "eslint-plugin/require-meta-fixable": [
          ERROR,
          { catchNoFixerButFixableProperty: true },
        ],
        "eslint-plugin/require-meta-has-suggestions": ERROR,
      },
    },
    {
      files: [
        "packages/react-native-renderer/**/*.js",
        "packages/react-server-native-relay/**/*.js",
      ],
      globals: {
        nativeFabricUIManager: "readonly",
      },
    },
    {
      files: ["packages/react-server-dom-webpack/**/*.js"],
      globals: {
        __webpack_chunk_load__: "readonly",
        __webpack_require__: "readonly",
      },
    },
    {
      files: ["packages/scheduler/**/*.js"],
      globals: {
        TaskController: "readonly",
      },
    },
  ],

  globals: {
    spyOnDev: "readonly",
    spyOnDevAndProd: "readonly",
    spyOnProd: "readonly",
    __EXPERIMENTAL__: "readonly",
    __EXTENSION__: "readonly",
    __PROFILE__: "readonly",
    __TEST__: "readonly",
    __UMD__: "readonly",
    __VARIANT__: "readonly",
    gate: "readonly",
    trustedTypes: "readonly",
    IS_REACT_ACT_ENVIRONMENT: "readonly",
  },
};
```

6. 根据控制台此时的报错，找到报错信息以 react-internal 开头文件，然后搜索 react-internal，把相关注释全部去掉。或者在 react/packages 下暴力全局搜索 react-internal，把包含 react-internal 的注释行全部删掉。当然后者东西比较多，因为全局下有些文件里的 react-internal 并不影响运行，可以不删除的。建议选择前者。
