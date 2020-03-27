//!vnode 就代表虚拟dom节点
//! node代表真实dom节点

// 接收type, props, children， 返回一个vnode
function createElement(type, props, ...children) {
  // console.log("createElement", arguments); //sy-log
  if (props) {
    delete props.__source;
    delete props.__self;
  }

  let defaultProps = {};
  if (type && type.defaultProps) {
    defaultProps = {...type.defaultProps};
  }
  return {
    type: type,
    props: {
      ...defaultProps,
      ...props,
      //!这里的处理与源码稍有不同，源里的话，只有一个元素，children是对象，多于一个的时候，是数组
      children: children.map(child =>
        typeof child === "object" ? child : createTextNode(child)
      )
    }
  };
}

function createTextNode(text) {
  return {
    type: "TEXT",
    props: {
      children: [],
      nodeValue: text
    }
  };
}
export default {
  createElement
};
