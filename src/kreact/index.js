import {TEXT} from "./const";

function createElement(type, config, ...children) {
  if (config) {
    delete config.__self;
    delete config.__source;
  }
  let props = {};
  for (let k in config) {
    if (k !== "key") {
      props[k] = config[k];
    }
  }

  let defaultProps = {};
  if (type && type.defaultProps) {
    defaultProps = {...type.defaultProps};
  }

  return {
    type,
    key: config.key || "",
    props: {
      ...defaultProps,
      ...props,
      children: children
        .filter(k => k !== null)
        .map(child => {
          return typeof child === "object" ? child : createTextNode(child);
        })
    }
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
