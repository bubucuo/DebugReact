# React 源码学习指南

关注公众号：bubucuo，回复 debug，就能拿到 DebugReact 压缩包。

## 前言

本项目用于调试源码，即修改配置使得项目中引用的 react 包来自 src/react，使得我们可以在 src/react 下 debug 和打 log 调试。

## 资源

1. [源码文件指引地址]([React 源码文件指引 | ProcessOn 免费在线作图,在线流程图,在线思维导图](https://www.processon.com/view/link/60b206c2e0b34d3841931a88))

## 使用步骤

1. 在根目录下安装： yarn add
2. 下载 react 包到 src 下，并按照下面的修改配置步骤修改 react 中的文件。
3. 在根目录下启动： yarn start

## 自己从 github 下载 react 包并修改配置



1. /src/react/packages/scheduler/index.js

```jsx
'use strict';

export * from './src/forks/Scheduler';

// sy 添加以下
export {
  log,
  unstable_flushAllWithoutAsserting,
  unstable_flushNumberOfYields,
  unstable_flushExpired,
  unstable_flushUntilNextPaint,
  unstable_flushAll,
  unstable_advanceTime,
  unstable_setDisableYieldValue,
} from './src/forks/SchedulerMock';
```

2. /src/react/packages/react-reconciler/src/ReactFiberConfig.js

```jsx
// throw new Error('This module must be shimmed by a specific renderer.');
// sy
export * from "./forks/ReactFiberConfig.dom";
```

3. /src/react/packages/shared/ReactSharedInternals.js

```jsx
// import * as React from 'react';

// const ReactSharedInternals =
//   React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;

// sy
import ReactSharedInternals from '../react/src/ReactSharedInternalsClient'


export default ReactSharedInternals;
```

  4. react/.eslintrc.js

我修改后的文件如下：

```js
'use strict';

const {
  es5Paths,
  esNextPaths,
} = require('./scripts/shared/pathsByLanguageVersion');

const restrictedGlobals = require('confusing-browser-globals');

const OFF = 0;
const WARNING = 1;
const ERROR = 2;

module.exports = {
  extends: [],

  // Stop ESLint from looking for a configuration file in parent folders
  root: true,

  plugins: [
    // 'babel',
    // 'ft-flow',
    'jest',
    // 'no-for-of-loops',
    // 'no-function-declare-after-return',
    'react',
    // 'react-internal',
  ],

  parser: 'hermes-eslint',
  parserOptions: {
    ecmaVersion: 9,
    sourceType: 'script',
  },

  // We're stricter than the default config, mostly. We'll override a few rules
  // and then enable some React specific ones.
  rules: {
    // 'ft-flow/array-style-complex-type': [OFF, 'verbose'],
    // 'ft-flow/array-style-simple-type': [OFF, 'verbose'], // TODO should be WARNING
    // 'ft-flow/boolean-style': ERROR,
    // 'ft-flow/no-dupe-keys': ERROR,
    // 'ft-flow/no-primitive-constructor-types': ERROR,
    // 'ft-flow/no-types-missing-file-annotation': OFF, // TODO should be ERROR
    // 'ft-flow/no-unused-expressions': ERROR,
    // 'ft-flow/no-weak-types': WARNING,
    // 'ft-flow/require-valid-file-annotation': ERROR,

    'no-cond-assign': OFF,
    'no-constant-condition': OFF,
    'no-control-regex': OFF,
    'no-debugger': OFF,
    'no-dupe-args': ERROR,
    'no-dupe-keys': ERROR,
    'no-duplicate-case': WARNING,
    'no-empty-character-class': WARNING,
    'no-empty': OFF,
    'no-ex-assign': WARNING,
    'no-extra-boolean-cast': WARNING,
    'no-func-assign': ERROR,
    'no-invalid-regexp': WARNING,
    'no-irregular-whitespace': WARNING,
    'no-negated-in-lhs': ERROR,
    'no-obj-calls': ERROR,
    'no-regex-spaces': WARNING,
    'no-sparse-arrays': ERROR,
    'no-unreachable': OFF,
    'use-isnan': ERROR,
    'valid-jsdoc': OFF,
    'block-scoped-var': OFF,
    complexity: OFF,
    'default-case': OFF,
    'guard-for-in': OFF,
    'no-alert': OFF,
    'no-caller': ERROR,
    'no-case-declarations': OFF,
    'no-div-regex': OFF,
    'no-else-return': OFF,
    'no-empty-pattern': WARNING,
    'no-eq-null': OFF,
    'no-eval': ERROR,
    'no-extend-native': WARNING,
    'no-extra-bind': WARNING,
    'no-fallthrough': WARNING,
    'no-implicit-coercion': OFF,
    'no-implied-eval': ERROR,
    'no-invalid-this': OFF,
    'no-iterator': OFF,
    'no-labels': [ERROR, {allowLoop: true, allowSwitch: true}],
    'no-lone-blocks': WARNING,
    'no-loop-func': OFF,
    'no-magic-numbers': OFF,
    'no-multi-str': ERROR,
    'no-native-reassign': [ERROR, {exceptions: ['Map', 'Set']}],
    'no-new-func': ERROR,
    'no-new': WARNING,
    'no-new-wrappers': WARNING,
    'no-octal-escape': WARNING,
    'no-octal': WARNING,
    'no-param-reassign': OFF,
    'no-process-env': OFF,
    'no-proto': ERROR,
    'no-redeclare': OFF, // TODO should be WARNING?
    'no-return-assign': OFF,
    'no-script-url': ERROR,
    'no-self-compare': WARNING,
    'no-sequences': WARNING,
    'no-throw-literal': ERROR,
    'no-useless-call': WARNING,
    'no-void': OFF,
    'no-warning-comments': OFF,
    'no-with': OFF,
    radix: WARNING,
    'vars-on-top': OFF,
    yoda: OFF,
    'init-declarations': OFF,
    'no-catch-shadow': ERROR,
    'no-delete-var': ERROR,
    'no-label-var': WARNING,
    'no-shadow-restricted-names': WARNING,
    'no-undef-init': OFF,
    'no-undef': OFF,
    'no-undefined': OFF,
    'callback-return': OFF,
    'global-require': OFF,
    'handle-callback-err': OFF,
    'no-mixed-requires': OFF,
    'no-new-require': OFF,
    'no-path-concat': OFF,
    'no-process-exit': OFF,
    'no-restricted-modules': OFF,
    'no-sync': OFF,
    camelcase: [OFF, {properties: 'always'}],
    'consistent-this': [OFF, 'self'],
    'func-names': OFF,
    'func-style': [OFF, 'declaration'],
    'id-length': OFF,
    'id-match': OFF,
    'max-depth': OFF,
    'max-nested-callbacks': OFF,
    'max-params': OFF,
    'max-statements': OFF,
    'new-cap': OFF,
    'newline-after-var': OFF,
    'no-array-constructor': ERROR,
    'no-continue': OFF,
    'no-inline-comments': OFF,
    'no-lonely-if': OFF,
    'no-negated-condition': OFF,
    'no-nested-ternary': OFF,
    'no-new-object': WARNING,
    'no-plusplus': OFF,
    'no-ternary': OFF,
    'no-underscore-dangle': OFF,
    'no-unneeded-ternary': WARNING,
    'one-var': [WARNING, {initialized: 'never'}],
    'operator-assignment': [WARNING, 'always'],
    'require-jsdoc': OFF,
    'sort-vars': OFF,
    'spaced-comment': [
      OFF,
      'always',
      {exceptions: ['jshint', 'jslint', 'eslint', 'global']},
    ],
    'constructor-super': ERROR,
    'no-class-assign': WARNING,
    'no-const-assign': ERROR,
    'no-dupe-class-members': ERROR,
    'no-this-before-super': ERROR,
    'object-shorthand': OFF,
    'prefer-const': OFF,
    'prefer-spread': OFF,
    'prefer-reflect': OFF,
    'prefer-template': OFF,
    'require-yield': OFF,
    'babel/generator-star-spacing': OFF,
    'babel/new-cap': OFF,
    'babel/array-bracket-spacing': OFF,
    'babel/object-curly-spacing': OFF,
    'babel/object-shorthand': OFF,
    'babel/arrow-parens': OFF,
    'babel/no-await-in-loop': OFF,
    'babel/flow-object-type': OFF,
    'react/display-name': OFF,
    'react/forbid-prop-types': OFF,
    'react/jsx-closing-bracket-location': OFF,
    'react/jsx-curly-spacing': OFF,
    'react/jsx-equals-spacing': WARNING,
    'react/jsx-filename-extension': OFF,
    'react/jsx-first-prop-new-line': OFF,
    'react/jsx-handler-names': OFF,
    'react/jsx-indent': OFF,
    'react/jsx-indent-props': OFF,
    'react/jsx-key': OFF,
    'react/jsx-max-props-per-line': OFF,
    'react/jsx-no-bind': OFF,
    'react/jsx-no-duplicate-props': ERROR,
    'react/jsx-no-literals': OFF,
    'react/jsx-no-target-blank': OFF,
    'react/jsx-pascal-case': OFF,
    'react/jsx-sort-props': OFF,
    'react/jsx-uses-vars': ERROR,
    'react/no-comment-textnodes': OFF,
    'react/no-danger': OFF,
    'react/no-deprecated': OFF,
    'react/no-did-mount-set-state': OFF,
    'react/no-did-update-set-state': OFF,
    'react/no-direct-mutation-state': OFF,
    'react/no-multi-comp': OFF,
    'react/no-render-return-value': OFF,
    'react/no-set-state': OFF,
    'react/no-string-refs': OFF,
    'react/no-unknown-property': OFF,
    'react/prefer-es6-class': OFF,
    'react/prefer-stateless-function': OFF,
    'react/prop-types': OFF,
    'react/require-extension': OFF,
    'react/require-optimization': OFF,
    'react/require-render-return': OFF,
    'react/sort-comp': OFF,
    'react/sort-prop-types': OFF,

    'accessor-pairs': OFF,
    'brace-style': OFF,//[ERROR, '1tbs'],
    'consistent-return': OFF,
    'dot-location': [ERROR, 'property'],
    // We use console['error']() as a signal to not transform it:
    'dot-notation': [ERROR, {allowPattern: '^(error|warn)$'}],
    'eol-last': ERROR,
    eqeqeq: [ERROR, 'allow-null'],
    indent: OFF,
    'jsx-quotes': OFF,//[ERROR, 'prefer-double'],
    'keyword-spacing': OFF,// [ERROR, {after: true, before: true}],
    'no-bitwise': OFF,
    'no-console': OFF,
    'no-inner-declarations': [ERROR, 'functions'],
    'no-multi-spaces': OFF,
    'no-restricted-globals': [ERROR].concat(restrictedGlobals),
    'no-restricted-syntax': [
      ERROR,
      'WithStatement',
      {
        selector: 'MemberExpression[property.name=/^(?:substring|substr)$/]',
        message: 'Prefer string.slice() over .substring() and .substr().',
      },
    ],
    'no-shadow': ERROR,
    // 'no-unused-vars':OFF,// [ERROR, {args: 'none'}],
    'no-use-before-define': OFF,
    'no-useless-concat': OFF,
    quotes: OFF,// [ERROR, 'single', {avoidEscape: true, allowTemplateLiterals: true}],
    'space-before-blocks': ERROR,
    'space-before-function-paren': OFF,
    'valid-typeof': [ERROR, {requireStringLiterals: true}],
    // Flow fails with non-string literal keys
    'no-useless-computed-key': OFF,

    // We apply these settings to files that should run on Node.
    // They can't use JSX or ES6 modules, and must be in strict mode.
    // They can, however, use other ES6 features.
    // (Note these rules are overridden later for source files.)
    'no-var': OFF,
    strict: ERROR,

    // Enforced by Prettier
    // TODO: Prettier doesn't handle long strings or long comments. Not a big
    // deal. But I turned it off because loading the plugin causes some obscure
    // syntax error and it didn't seem worth investigating.
    'max-len': OFF,

    // React & JSX
    // Our transforms set this automatically
    'react/jsx-boolean-value': [ERROR, 'always'],
    'react/jsx-no-undef': OFF,
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
    'no-for-of-loops/no-for-of-loops': OFF,

    // Prevent function declarations after return statements
    'no-function-declare-after-return/no-function-declare-after-return': OFF,

    // CUSTOM RULES
    // the second argument of warning/invariant should be a literal string
    // 'react-internal/no-primitive-constructors': OFF,
    // 'react-internal/safe-string-coercion': [
    //   ERROR,
    //   {isProductionUserAppCode: true},
    // ],
    // 'react-internal/no-to-warn-dev-within-to-throw': ERROR,
    // 'react-internal/warning-args': ERROR,
    // 'react-internal/no-production-logging': ERROR,

    // "react-internal/*": "off",
  },

  overrides: [
    // {
    //   // By default, anything error message that appears the packages directory
    //   // must have a corresponding error code. The exceptions are defined
    //   // in the next override entry.
    //   files: ['packages/**/*.js'],
    //   rules: {
    //     'react-internal/prod-error-codes': ERROR,
    //   },
    // },
    // {
    //   // These are files where it's OK to have unminified error messages. These
    //   // are environments where bundle size isn't a concern, like tests
    //   // or Node.
    //   files: [
    //     'packages/react-dom/src/test-utils/**/*.js',
    //     'packages/react-devtools-shared/**/*.js',
    //     'packages/react-noop-renderer/**/*.js',
    //     'packages/react-refresh/**/*.js',
    //     'packages/react-server-dom-esm/**/*.js',
    //     'packages/react-server-dom-webpack/**/*.js',
    //     'packages/react-server-dom-turbopack/**/*.js',
    //     'packages/react-server-dom-fb/**/*.js',
    //     'packages/react-test-renderer/**/*.js',
    //     'packages/react-debug-tools/**/*.js',
    //     'packages/react-devtools-extensions/**/*.js',
    //     'packages/react-devtools-timeline/**/*.js',
    //     'packages/react-native-renderer/**/*.js',
    //     'packages/eslint-plugin-react-hooks/**/*.js',
    //     'packages/jest-react/**/*.js',
    //     'packages/internal-test-utils/**/*.js',
    //     'packages/**/__tests__/*.js',
    //     'packages/**/npm/*.js',
    //   ],
    //   rules: {
    //     'react-internal/prod-error-codes': OFF,
    //   },
    // },
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
        // strict: ERROR,
      },
    },
    {
      // We apply these settings to the source files that get compiled.
      // They can use all features including JSX (but shouldn't use `var`).
      files: esNextPaths,
      parser: 'hermes-eslint',
      parserOptions: {
        ecmaVersion: 8,
        sourceType: 'module',
      },
      rules: {
        'no-var': OFF,
        'prefer-const': OFF,
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
        'dangerfile.js',
        'fixtures',
        'packages/react-dom/src/test-utils/*.js',
      ],
      // rules: {
      //   'react-internal/no-production-logging': OFF,
      //   'react-internal/warning-args': OFF,
      //   'react-internal/safe-string-coercion': [
      //     ERROR,
      //     {isProductionUserAppCode: false},
      //   ],
      // },
    },
    {
      files: [
        'scripts/eslint-rules/*.js',
        'packages/eslint-plugin-react-hooks/src/*.js',
      ],
      plugins: ['eslint-plugin'],
      rules: {
        'eslint-plugin/prefer-object-rule': ERROR,
        'eslint-plugin/require-meta-fixable': [
          ERROR,
          {catchNoFixerButFixableProperty: true},
        ],
        'eslint-plugin/require-meta-has-suggestions': ERROR,
      },
    },
    {
      files: ['packages/react-native-renderer/**/*.js'],
      globals: {
        nativeFabricUIManager: 'readonly',
      },
    },
    {
      files: ['packages/react-server-dom-webpack/**/*.js'],
      globals: {
        __webpack_chunk_load__: 'readonly',
        __webpack_require__: 'readonly',
      },
    },
    {
      files: ['packages/react-server-dom-turbopack/**/*.js'],
      globals: {
        __turbopack_load__: 'readonly',
        __turbopack_require__: 'readonly',
      },
    },
    {
      files: ['packages/scheduler/**/*.js'],
      globals: {
        TaskController: 'readonly',
      },
    },
    {
      files: ['packages/react-devtools-extensions/**/*.js'],
      globals: {
        __IS_CHROME__: 'readonly',
        __IS_FIREFOX__: 'readonly',
        __IS_EDGE__: 'readonly',
      },
    },
  ],

  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true,
  },

  globals: {
    $Call: 'readonly',
    $ElementType: 'readonly',
    $Flow$ModuleRef: 'readonly',
    $FlowFixMe: 'readonly',
    $Keys: 'readonly',
    $NonMaybeType: 'readonly',
    $PropertyType: 'readonly',
    $ReadOnly: 'readonly',
    $ReadOnlyArray: 'readonly',
    $ArrayBufferView: 'readonly',
    $Shape: 'readonly',
    ReturnType: 'readonly',
    AnimationFrameID: 'readonly',
    // For Flow type annotation. Only `BigInt` is valid at runtime.
    bigint: 'readonly',
    BigInt: 'readonly',
    BigInt64Array: 'readonly',
    BigUint64Array: 'readonly',
    Class: 'readonly',
    ClientRect: 'readonly',
    CopyInspectedElementPath: 'readonly',
    DOMHighResTimeStamp: 'readonly',
    EventListener: 'readonly',
    Iterable: 'readonly',
    Iterator: 'readonly',
    JSONValue: 'readonly',
    JSResourceReference: 'readonly',
    MouseEventHandler: 'readonly',
    PropagationPhases: 'readonly',
    PropertyDescriptor: 'readonly',
    React$AbstractComponent: 'readonly',
    React$Component: 'readonly',
    React$ComponentType: 'readonly',
    React$Config: 'readonly',
    React$Context: 'readonly',
    React$Element: 'readonly',
    React$ElementConfig: 'readonly',
    React$ElementProps: 'readonly',
    React$ElementRef: 'readonly',
    React$ElementType: 'readonly',
    React$Key: 'readonly',
    React$Node: 'readonly',
    React$Portal: 'readonly',
    React$Ref: 'readonly',
    ReadableStreamController: 'readonly',
    RequestInfo: 'readonly',
    RequestOptions: 'readonly',
    StoreAsGlobal: 'readonly',
    symbol: 'readonly',
    SyntheticEvent: 'readonly',
    SyntheticMouseEvent: 'readonly',
    Thenable: 'readonly',
    TimeoutID: 'readonly',
    WheelEventHandler: 'readonly',
    FinalizationRegistry: 'readonly',

    spyOnDev: 'readonly',
    spyOnDevAndProd: 'readonly',
    spyOnProd: 'readonly',
    __DEV__: 'readonly',
    __EXPERIMENTAL__: 'readonly',
    __EXTENSION__: 'readonly',
    __PROFILE__: 'readonly',
    __TEST__: 'readonly',
    __UMD__: 'readonly',
    __VARIANT__: 'readonly',
    __unmockReact: 'readonly',
    gate: 'readonly',
    trustedTypes: 'readonly',
    IS_REACT_ACT_ENVIRONMENT: 'readonly',
    AsyncLocalStorage: 'readonly',
    async_hooks: 'readonly',
    globalThis: 'readonly',
  },
};

```

5. `yarn start`启动项目，根据控制台此时的报错，相关的eslint行去掉。 
