# React v17.0 RC 版本发布：无新特性

RC：Release Candidate



## 资源

[React原文地址](https://reactjs.org/blog/2020/08/10/react-v17-rc.html)

[译文地址](https://mp.weixin.qq.com/s/fpcTFFnOS6JwLi7wq3OF0w)



## 知识点

### 无新特性

相比别的版本来说，React 17 的版本是有些不同的，因为这个版本没有添加任何面向开发人员的新功能。而主要侧重于**「升级简化 React 本身」**。

目前我们正在积极开发 React 的新功能，但还没有发布在React17版本，React 17 是我们进行深度推广战略的关键部分。

此版本之所以特殊，你可以认为**「React 17 是 "垫脚石" 版本」**，它会使得由一个 React 版本管理的 tree 嵌入到另一个 React 版本管理的 tree 中时会更加安全。

### 逐步升级

在过去 7 年里，React 一直遵循 "all-or-nothing" 的升级策略。你可以继续使用旧版本，也可以将整个应用程序升级至新版本。但没有介于两者之间的情况。

此方式持续至今，但是我们遇到了 "all-or-nothing" 升级策略的局限性。许多 API 的变更，例如，弃用旧版 context API 时，并不能以自动化的方式来完成。至今可能大多数应用程序从未使用过它们，但我们仍然选择在 React 中支持它们。我们必须在无限期支持过时的 API 或针对某些应用仍使用旧版本 React 间进行选择。但这两个方案都不合适。

因此，我们想提供另一种方案。

**「React 17 开始支持逐步升级 React 版本」**。当从 React 15 升级至 16 时（或者从 React 16 升级至 17时），通常会一次升级整个应用程序。这适用于大部分应用程序。但是，如果代码库是在几年前编写的，并且并没有得到很好的维护，那么升级它会变得越来越有挑战性。尽管可以在页面上使用两个版本的 React，但是直到 React 17 依旧有事件问题出现。

我们使用 React 17 解决了许多诸如此类的问题。这将意味着**「当 React 18 或未来版本问世时，你将有更多选择」**。首选还是像以前一样，一次升级整个应用程序。但你也可以选择逐步升级你的应用程序。例如，你可能会将大部分应用程序迁移至 React 18，但在 React 17 上保留一些延迟加载的对话框或子路由。

但这不意味着你**必须**逐步升级。对于大部分应用程序来说，一次全量升级仍是最好的解决方案。加载两个 React 版本，即使其中一个是按需延迟加载的，仍然不太理想。但是，对于没有积极维护的大型应用来说，可以考虑此种方案，并且 React 17 开始可以保证这些应用程序不落伍。

为了实现逐步升级，我们需要对 React 事件系统进行一些更改。而这些更改可能会对代码产生影响，这也是 React 17 成为主要版本的原因。实际上，10 万个以上的组件中受影响的组件不超过 20 个，因此，**「我们希望大多数应用程序都可以升级到 React 17，而不会产生太多影响」**。如果你遇到问题，请联系我们。



#### 逐步升级 Demo

我们准备了一个示例 repo，展示了如何在必要时延迟加载旧版本的 React。此 demo 使用了 Create React App 进行构建，但对其他工具采用类似的方法应该也适用。我们欢迎使用其他工具的开发者编写 demo 并提交 pr。

> 注意
>
> 我们已将**「其他更改推迟」**到 React 17 之后。此版本的目标是实现逐步升级。如果升级 React 17 太困难，则此目标会无法实现。



### 更改事件委托

从技术上讲，始终可以在应用程序中嵌套不同版本的 React。但是，由于 React 事件系统的工作原理，这很难实现。

在 React 组件中，通常会内联编写事件处理：

```jsx
<button onClick={handleClick}>
```

与此代码等效的 原生DOM 操作如下：

```jsx
myButton.addEventListener('click', handleClick);
```

但是，对大多数事件来说，React 实际上并不会将它们附加到 DOM 节点上。相反，React 会直接在 `document` 节点上为每种事件类型附加一个处理器。这被称为事件委托。除了在大型应用程序上具有性能优势外，它还使添加类似于 replaying events 这样的新特性变得更加容易。

自从其发布以来，React 一直自动进行事件委托。当 document 上触发 DOM 事件时，React 会找出调用的组件，然后 React 事件会在组件中向上 "冒泡"。但实际上，原生事件已经冒泡出了 "文档" 级别，React 在其中安装了事件处理器。

但是，这就是逐步升级的困难所在。

如果页面上有多个 React 版本，他们都将在顶层注册事件处理器。这会破坏 `e.stopPropagation()`：如果嵌套树结构中阻止了事件冒泡，但外部树依然能接收到它。这会使不同版本 React 嵌套变得困难重重。这种担忧并不是没有根据的 —— 例如，四年前 Atom 编辑器就遇到了相同的问题。

这也是我们为什么要改变 React 底层附加事件方式的原因。

**「在 React 17 中，React 将不再向 document 附加事件处理器。而会将事件处理器附加到渲染 React 树的根 DOM 容器中：」**

```js
const rootNode = document.getElementById('root');ReactDOM.render(<App />, rootNode);
```

在 React 16 或更早版本中，React 会对大多数事件执行 `document.addEventListener()`。React 17 将会在底层调用 `rootNode.addEventListener()`。

![img](https://mmbiz.qpic.cn/mmbiz_png/INNfEriciaG5cTIajWylrQ2Xa4tbTyGnyyekmf85ZthoZM3nLykRg9223xG0gib58xJd54AZ77FziacrQ254oibw8Yw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)



由于此更改，**「现在可以更加安全地进行新旧版本 React 树的嵌套」**。请注意，要使其正常工作，两个版本都必须为 17 或更高版本，这就是为什么强烈建议升级到 React 17 的根本原因。从某种意义上讲，React 17 是一个 "垫脚石" 版本，使逐步升级成为可能。

此更改还使得**「将 React 嵌入使用其他技术构建的应用程序变得更加容易」**。例如，如果应用程序的 "外壳" 是用 jQuery 编写的，但其中较新的代码是用 React 编写的，则 React 代码中的 `e.stopPropagation()` 会阻止它影响 jQuery 的代码 —— 符合预期。换个角度来说，如果你不再喜欢 React 并想重写应用程序（比如，用 jQuery），则可以从外壳开始将 React 转换为 jQuery，而不会破坏事件冒泡。

经核实，多年来在 issue 追踪器 上报告的许多问题都已被新特性解决，这些问题大多都与将 React 与非 React 代码集成有关。

> 注意
>
> 你可能想知道这是否会破坏 root container 之外的 Portals。答案是 React 还会监听 portals container 上的事件，所以这不是问题。



#### 解决隐患

与其他重大更改一样，可能需要对代码进行调整。在 Facebook，我们在成千上万个模块中，大约调整了 10 个模块以适应此更改。

例如，如果模块中使用 `document.addEventListener(...)` 手动添加了 DOM 监听，你可能希望能捕获到所有 React 事件。在 React 16 或更早版本中，即使你在 React 事件处理器中调用 `e.stopPropagation()`，你创建的 DOM 监听仍会触发，这是因为原生事件已经处于 document 级别。使用 React 17 冒泡将被阻止（按需），因此你的 `document` 级别的事件监听不会触发：

```js
document.addEventListener('click', function() {
  // This custom handler will no longer receive clicks
  // from React components that called e.stopPropagation()
});
```

你可以将监听转换为使用捕获来修复此类代码。为此，你可以将 `{ capture: true }` 作为 `document.addEventListener` 的第三个参数传递：

```js
document.addEventListener('click', function() {
  // Now this event handler uses the capture phase,
  // so it receives *all* click events below!
}, { capture: true });
```

请注意，此策略在全局上具有更好的适应性。例如，它可能会修复代码中现有的错误，这些错误在 React 事件处理器外部调用 `e.stopPropagation()` 发生。换句话说，**「React 17 的事件冒泡更接近常规 DOM」**。



### 其他重大更改

我们将 React 17 中的重大更改保持在最低水平。例如，它不会删除以前版本中弃用的任务方法。但是，它的确包含一些其他重大更改，根据经验，这些更改会相对安全。总体而言，由于这些因素的存在，在 10 万个以上的组件中受影响的组件不超过 20 个。

#### 对标浏览器

我们对事件系统进行了一些较小的更改：

- `onScroll` 事件**「不再冒泡」**，以防止出现常见的混淆。
- React 的 `onFocus` 和 `onBlur` 事件已在底层切换为原生的 `focusin` 和 `focusout` 事件。它们更接近 React 现有行为，有时还会提供额外的信息。
- 捕获事件（例如，`onClickCapture`）现在使用的是实际浏览器中的捕获监听器。

这些更改会使 React 与浏览器行为更接近，并提高了互操作性。

#### 去除事件池

React 17 中移除了 "event pooling（事件池）"。它并不会提高现代浏览器的性能，甚至还会使经验丰富的开发者一头雾水：

```js
function handleChange(e) {
  setData(data => ({
    ...data,
    // This crashes in React 16 and earlier:
    text: e.target.value
  }));
}
```

这是因为 React 在旧浏览器中重用了不同事件的事件对象，以提高性能，并将所有事件字段在它们之前设置为 `null`。在 React 16 及更早版本中，使用者必须调用 `e.persist()` 才能正确的使用该事件，或者正确读取需要的属性。

**「在 React 17 中，此代码可以按照预期效果执行。旧的事件池优化操作已被完成删除，因此，使用者可以在需要时读取事件字段。」**

这改变了行为，因此我们将其标记为重大更改，但在实践中我们没有看到它在 Facebook 上造成影响。（甚至还修复了一些错误！）请注意，`e.persist()` 在 React 事件对象中仍然可用，只是无效果罢了。

#### 副作用清理时间

我们正在使 `useEffect` 和清理函数的时间保持一致。

```js
useEffect(() => {
  // This is the effect itself.
  return () => {
    // This is its cleanup.
  };
});
```

大多数副作用（effect）不需要延迟屏幕更新，因此 React 在屏幕上反映出更新后立即异步执行它们。（在极少数情况下，你需要一种副作用来阻止绘制，例如，如果需要获取尺寸和位置，请使用 `useLayoutEffect`。）

然而，副作用**清理**函数（如果存在）在 React 16 中同步运行。我们发现，对于大型应用程序来说，这不是理想选择，因为同步会减缓屏幕的过渡（例如，切换标签）。

**「在 React 17 中，副作用清理函数会异步执行 —— 如果要卸载组件，则清理会在屏幕更新后运行。」**

这反映了副作用本身如何更紧密地运行。在极少数情况下，你可能希望依靠同步执行，可以改用 `useLayoutEffect`。

> 注意
>
> 你可能想知道这是否意味着你现在将无法修复有关未挂载组件上的 `setState` 的警告。不必担心，React 专门处理了这种情况，并且不会在卸载和清理之间短暂间隔内发出 `setState` 的警告。**「因此，取消代码的请求或间隔几乎总是可以保存不变的。」**

此外，React 17 会根据它们在树中的位置，以与效果相同的顺序执行清除功能。以前，顺序有时会不同。

##### 隐患

可复用的库可能需要对此情况进行深度测试，但我们只遇到了几个组件会因为此问题中断执行。有问题的代码的其中一个示例如下所示：

```js
useEffect(() => {
  someRef.current.someSetupMethod();
  return () => {
    someRef.current.someCleanupMethod();
  };
});
```

问题在于 `someRef.current` 是可变的，因此在运行清除函数时，它可能已经设置为 `null`。解决方案是在副作用**「内部」**存储会发生变化的值：

```js
useEffect(() => {
  const instance = someRef.current;
  instance.someSetupMethod();
  return () => {
    instance.someCleanupMethod();
  };
});
```

我们不希望此问题对大家造成影响，我们提供了 `eslint-plugin-react-hooks/exhaustive-deps` 的 lint 规则（请确保在项目中使用它）会对此情况发出警告。

#### 返回一致的 undefined 错误

在 React 16 及更早版本中，返回 `undefined` 始终是一个错误：

```
function Button() {
  return; // Error: Nothing was returned from render
}
```

部分原因是这很容易无意间返回 `undefined`：

```js
function Button() {
  // We forgot to write return, so this component returns undefined.
  // React surfaces this as an error instead of ignoring it.
  <button />;
}
```

以前，React 只对 class 和函数组件执行此操作，但并不会检查 `forwardRef` 和 `memo` 组件的返回值。这是由于编码错误导致。

**「在 React 17 中，forwardRef 和 memo 组件的行为会与常规函数组件和 class 组件保持一致。在返回 undefined 时会报错」**

```js
let Button = forwardRef(() => {
  // We forgot to write return, so this component returns undefined.
  // React 17 surfaces this as an error instead of ignoring it.
  <button />;
});

let Button = memo(() => {
  // We forgot to write return, so this component returns undefined.
  // React 17 surfaces this as an error instead of ignoring it.
  <button />;
});
```

对于不想进行任何渲染的情况，请返回 `null`。

#### 原生组件栈

当你在浏览器中遇到错误时，浏览器会为你提供带有 JavaScript 函数的名称及位置的堆栈信息。然而，JavaScript 堆栈通常不足以诊断问题，因为 React 树的层次结构可能同样重要。你不仅要知道哪个 `Buttom` 抛出了错误，而且还想知道 `Button` 在 React 树中的哪个位置。

为了解决这个问题，当你遇到错误时，从 React 16 开始会打印 "组件栈" 信息。尽管如此，它们仍然不如原生的 JavaScript 堆栈。特别是，它们在控制台中不可点击，因为 React 不知道函数在源代码中的声明位置。此外，它们在生产中几乎无用。不同于常规压缩后的 JavaScript 堆栈，它们可以通过 sourcemap 的形式自动恢复到原始函数的位置，而使用  React 组件栈，在生产环境下必须在堆栈信息和 bundle 大小间进行选择。

**「在 React 17 中，使用了不同的机制生成组件堆栈，该机制会将它们与常规的原生 JavaScript 堆栈缝合在一起。这使得你可以在生产环境中获得完全符号化的 React 组件堆栈信息。」**

React 实现这一点的方式有点非常规。目前，浏览器无法提供获取函数堆栈框架（源文件和位置）的方法。因此，当 React 捕获到错误时，将通过组件上述组件内部抛出的临时错误（并捕获）来重建其组件堆栈信息。这会增加崩溃时的性能损失，但每个组件类型只会发生一次。

如果你对此感兴趣，可以在这个 PR 中阅读更多详细信息，但是在大多数情况下，这种机制不会影响你的代码。从使用者的角度来看，新功能就是可以单击组件堆栈（因为它们依赖于本机浏览器堆栈框架），并且可以像常规 JavaScript 错误那样在生产中进行解码。

构成重大变化的部分是，要使此功能正常工作，React 将在捕获错误后在堆栈中重新执行上面某些函数和某些 class 构造函数的部分。由于渲染函数和 class 构造函数不应具有副作用（这对于 SSR 也很重要），因此这不会造成任何实际问题。

#### 移除私有导出

最后，值得注意的重大变化是我们删除了一些以前暴露给其他项目的 React 内部组件。特别是，React Native for Web 过去常常依赖于事件系统的某些内部组件，但这种依赖关系很脆弱且经常被破坏。

**「在 React 17 中，这些私有导出已被移除。据我们所知，React Native for Web 是唯一使用它们的项目，它们已经完成了向不依赖那些私有导出函数的其他方法迁移。」**

这意味着旧版本的 React Native for Web 不会与 React 17 兼容，但是新版本可以使用它。实际上，并没有太大的变化，因为 React Native for Web 必须发布新版本以适应其内部 React 的变化。

另外，我们删除了 `ReactTestUtils.SimulateNative` 的 helper 方法。他们从未被记录，没有按照他们名字所暗示的那样去做，也没有处理我们对事件系统所做的更改。如果你想要一种简便的方式来触发测试中原生浏览器的事件，请改用 React Testing Library。



### 安装

我们鼓励你尽快尝试 React 17.0 RC 版本，在迁移过程中遇到任何问题都可以向我们提出。**「请注意，候选版本没有稳定版本稳定，因此请不要将其部署到生产环境。」**

通过 npm 安装 React 17 RC 版，请执行：

```bash
npm install react@17.0.0-rc.0 react-dom@17.0.0-rc.0
```

通过 yarn 安装 React 17 RC 版，请执行：

```bash
yarn add react@17.0.0-rc.0 react-dom@17.0.0-rc.0
```

我们还通过 CDN 提供了 React RC 的 UMD 构建版本：

```js
<script crossorigin src="https://unpkg.com/react@17.0.0-rc.0/umd/react.production.min.js"></script><script crossorigin src="https://unpkg.com/react-dom@17.0.0-rc.0/umd/react-dom.production.min.js"></script>
```

有关详细安装说明，请参阅[安装文档](https://reactjs.org/docs/installation.html)。