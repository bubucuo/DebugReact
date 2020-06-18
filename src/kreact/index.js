import {TEXT} from "./const";

function createElement(type, config, ...children) {
  if (config) {
    delete config.__self;
    delete config.__source;
  }

  // let defaultProps = {};
  // if (type && type.defaultProps) {
  //   defaultProps = {...type.defaultProps};
  // }
  // ! 源码中做了详细处理，比如过滤掉key、ref等
  const props = {
    // ...defaultProps,
    ...config,
    children: children.map(child =>
      typeof child === "object" ? child : createTextNode(child)
    )
  };

  delete props.key;

  if (type && type.defaultProps) {
    const defaultProps = type.defaultProps;
    for (let propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
  }

  return {
    key: config.key || "",
    type,
    props
  };
}

function createTextNode(text) {
  return {
    type: TEXT,
    props: {
      children: [],
      nodeValue: text
    }
  };
}

export default {
  createElement
};
