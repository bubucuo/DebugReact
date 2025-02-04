# 本项目属于课程资源，已购买课程学员可以联系我「微信: bubucuo_sy」，获取完整版~
# 联系方式，

# React 源码学习指南

更多资源，关注公众号：bubucuo
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
{
  "name": "debug-react19",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@babel/core": "^7.26.0",
    "@pmmmwh/react-refresh-webpack-plugin": "0.4.2",
    "@svgr/webpack": "5.4.0",
    "@testing-library/jest-dom": "^5.11.4",
    "@testing-library/react": "^11.1.0",
    "@testing-library/user-event": "^12.1.10",
    "@typescript-eslint/eslint-plugin": "^4.5.0",
    "@typescript-eslint/parser": "^4.5.0",
    "babel-eslint": "^10.1.0",
    "babel-jest": "^26.6.0",
    "babel-loader": "8.1.0",
    "babel-plugin-named-asset-import": "^0.3.7",
    "babel-preset-react-app": "^10.0.0",
    "bfj": "^7.0.2",
    "camelcase": "^6.1.0",
    "case-sensitive-paths-webpack-plugin": "2.3.0",
    "classnames": "^2.3.2",
    "css-loader": "4.3.0",
    "dotenv": "8.2.0",
    "dotenv-expand": "5.1.0",
    "eslint": "^9.16.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-config-react-app": "^6.0.0",
    "eslint-plugin-flowtype": "^5.2.0",
    "eslint-plugin-ft-flow": "^3.0.11",
    "eslint-plugin-import": "^2.22.1",
    "eslint-plugin-jest": "^28.9.0",
    "eslint-plugin-jsx-a11y": "^6.3.1",
    "eslint-plugin-prettier": "^5.2.1",
    "eslint-plugin-react": "^7.21.5",
    "eslint-plugin-react-hooks": "^4.2.0",
    "eslint-plugin-testing-library": "^3.9.2",
    "eslint-webpack-plugin": "^2.1.0",
    "file-loader": "6.1.1",
    "fre": "^2.0.7",
    "fs-extra": "^9.0.1",
    "hermes-eslint": "^0.19.1",
    "html-webpack-plugin": "4.5.0",
    "identity-obj-proxy": "3.0.0",
    "jest": "26.6.0",
    "jest-circus": "26.6.0",
    "jest-resolve": "26.6.0",
    "jest-watch-typeahead": "0.6.1",
    "mini-css-extract-plugin": "0.11.3",
    "optimize-css-assets-webpack-plugin": "5.0.4",
    "pnp-webpack-plugin": "1.6.4",
    "postcss-flexbugs-fixes": "4.2.1",
    "postcss-loader": "3.0.0",
    "postcss-normalize": "8.0.1",
    "postcss-preset-env": "6.7.0",
    "postcss-safe-parser": "5.0.2",
    "prettier": "^3.4.2",
    "prompts": "2.4.0",
    "react": "^19",
    "react-app-polyfill": "^2.0.0",
    "react-dev-utils": "^11.0.1",
    "react-dom": "^19",
    "react-error-boundary": "^4.0.13",
    "react-refresh": "^0.8.3",
    "react-router": "^7.0.2",
    "resolve": "1.18.1",
    "resolve-url-loader": "^3.1.2",
    "sass-loader": "8.0.2",
    "semver": "7.3.2",
    "style-loader": "1.3.0",
    "terser-webpack-plugin": "4.2.3",
    "ts-pnp": "1.2.0",
    "url-loader": "4.1.1",
    "web-vitals": "^0.2.4",
    "webpack": "4.44.2",
    "webpack-dev-server": "3.11.0",
    "webpack-manifest-plugin": "2.2.0",
    "workbox-webpack-plugin": "5.1.4"
  },
  "scripts": {
    "start": "node --openssl-legacy-provider scripts/start.js",
    "build": "node scripts/build.js",
    "test": "node scripts/test.js"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "jest": {
    "roots": [
      "<rootDir>/src"
    ],
    "collectCoverageFrom": [
      "src/**/*.{js,jsx,ts,tsx}",
      "!src/**/*.d.ts"
    ],
    "setupFiles": [
      "react-app-polyfill/jsdom"
    ],
    "setupFilesAfterEnv": [
      "<rootDir>/src/setupTests.js"
    ],
    "testMatch": [
      "<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}",
      "<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}"
    ],
    "testEnvironment": "jsdom",
    "testRunner": "/Users/gaoshaoyun/workspace/react/omg/node_modules/jest-circus/runner.js",
    "transform": {
      "^.+\\.(js|jsx|mjs|cjs|ts|tsx)$": "<rootDir>/node_modules/babel-jest",
      "^.+\\.css$": "<rootDir>/config/jest/cssTransform.js",
      "^(?!.*\\.(js|jsx|mjs|cjs|ts|tsx|css|json)$)": "<rootDir>/config/jest/fileTransform.js"
    },
    "transformIgnorePatterns": [
      "[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|cjs|ts|tsx)$",
      "^.+\\.module\\.(css|sass|scss)$"
    ],
    "modulePaths": [],
    "moduleNameMapper": {
      "^react-native$": "react-native-web",
      "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy"
    },
    "moduleFileExtensions": [
      "web.js",
      "js",
      "web.ts",
      "ts",
      "web.tsx",
      "tsx",
      "json",
      "web.jsx",
      "jsx",
      "node"
    ],
    "watchPlugins": [
      "jest-watch-typeahead/filename",
      "jest-watch-typeahead/testname"
    ],
    "resetMocks": true
  },
  "babel": {
    "presets": [
      "react-app"
    ]
  },
  "devDependencies": {
    "@babel/plugin-proposal-export-default-from": "^7.12.1",
    "@babel/plugin-syntax-jsx": "^7.12.1",
    "@babel/plugin-transform-flow-strip-types": "^7.12.10",
    "eslint-plugin-no-for-of-loops": "^1.0.1"
  }
}

```

5. `yarn start`启动项目，根据控制台此时的报错，相关的eslint行去掉。 
