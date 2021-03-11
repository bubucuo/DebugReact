import {TEXT} from "./CONST";

// 如果是原生标签节点, type是字符串，如div、span
// 如果是文本节点， type就没有，这里我们为了方便简单自己定义成了TEXT，（源码中没有这么做）
// 如果是函数组件，type是函数名
// 如果是类组件，type是类名
function createElement(type, config, ...children) {
  if (config) {
    delete config.__self;
    delete config.__source;
  }
  // 今天先不考虑key、ref
  const props = {
    ...config,
    // 这里children为了简单方便，都处理成了数组，（源码当中没有这么做）
    children: children.map(child =>
      typeof child === "object" ? child : createTextNode(child)
    )
  };
  delete props.key;
  return {
    key: (config && config.key) || "",
    type,
    props
  };
}

// 把文本节点变成对象的形式，方便处理
function createTextNode(text) {
  return {
    type: TEXT,
    props: {
      nodeValue: text,
      children: []
    }
  };
}

export default {createElement};
