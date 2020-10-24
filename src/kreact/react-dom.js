import {TEXT, UPDATE, PLACEMENT, DELETION} from "./const";

// 下一个单元任务 数据类型就是fiber
let nextUnitOfWork = null;
// work in progress 正在工作当中的
// 正在工作当中的fiber root
let wipRoot = null;

// 存储当前的根节点
let currentRoot = null;
// 当前正在工作的fiber
let wipFiber = null;

//
let deletions = null;

// ! fiber数据结构
// type 标记fiber的类型
// key 标记当前层级下的唯一性
// props fiber属性
// base 上一次更新的fiber节点
// child 第一个子节点
// sibling 下一个兄弟节点
// return 父节点
// stateNode 真实dom节点
// effectTag 标识fiber类型（如插入、或者是更新）
// !

// todo vnode、vvnode 虚拟DOM节点
// todo node 真实DOM节点
function render(vnode, container) {
  // // 1. vnode->node
  // const node = createNode(vnode);
  // // 2. container.appendChild(node);
  // container.appendChild(node);

  wipRoot = {
    stateNode: container,
    props: {
      children: [vnode]
    }
  };

  nextUnitOfWork = wipRoot;
  deletions = [];
}

// 创建真实DOM节点
function createNode(vnode) {
  let node;

  const {type, props} = vnode;
  if (type === TEXT) {
    node = document.createTextNode("");
  } else if (typeof type === "string") {
    node = document.createElement(type);
  }
  // else if (typeof type === "function") {
  //   node = type.prototype.isReactComponent
  //     ? updateClassComponent(vnode)
  //     : updateFunctionComponent(vnode);
  // } else {
  //   // * 这个地方是个简写，源码当中没有生成Fragment，直接协调的子节点
  //   node = document.createDocumentFragment();
  // }
  // reconcileChildren(props.children, node);
  updateNode(node, {}, props);
  return node;
}

function updateNode(node, prevVal, nextVal) {
  // 更新老属性
  Object.keys(prevVal)
    .filter(k => k !== "children")
    .forEach(k => {
      // ! 瞎写一下
      // 判断一下，这里以on开头就是合成事件
      if (k.slice(0, 2) === "on") {
        let eventName = k.slice(2).toLowerCase();
        node.removeEventListener(eventName, prevVal[k]);
      } else {
        if (!(k in nextVal)) {
          node[k] = "";
        }
      }
    });

  Object.keys(nextVal)
    .filter(k => k !== "children")
    .forEach(k => {
      // ! 瞎写一下
      // 判断一下，这里以on开头就是合成事件
      if (k.slice(0, 2) === "on") {
        let eventName = k.slice(2).toLowerCase();
        node.addEventListener(eventName, nextVal[k]);
      } else {
        node[k] = nextVal[k];
      }
    });
}

// 返回真实dom节点
// 执行函数
function updateFunctionComponent(fiber) {
  wipFiber = fiber;
  wipFiber.hooks = [];
  wipFiber.hookIndex = 0;

  const {type, props} = fiber;
  let children = [type(props)];
  reconcileChildren(fiber, children);
}

// 返回真实dom节点
// 先实例化，再执行render函数
function updateClassComponent(fiber) {
  const {type, props} = fiber;
  let cmp = new type(props);
  let vvnode = cmp.render();
  const children = [vvnode];
  reconcileChildren(fiber, children);
}

// 原生标签节点更新
function updateHostComponent(fiber) {
  // 判断真实dom节点是否存在，不存在的话，去创建
  if (!fiber.stateNode) {
    fiber.stateNode = createNode(fiber);
  }

  const {children} = fiber.props;
  reconcileChildren(fiber, children);
  // console.log("fiber", fiber); //sy-log
}

// 遍历下子vnode，然后把子vnode->真实DOM节点，再插入父node中
// function reconcileChildren(children, node) {
//   for (let i = 0; i < children.length; i++) {
//     let child = children[i];
//     render(child, node);
//   }
// }

// 1 2 3
// 2 3 4
// ! 今天没有考虑位置移动，下节课继续这一点
function reconcileChildren(workInProgress, children) {
  // 记录上一个的哥哥fiber
  let prevSibling = null;
  let oldFiber = workInProgress.base && workInProgress.base.child;
  for (let i = 0; i < children.length; i++) {
    let child = children[i];
    // 看下能不能复用,
    // ! 今天先不考虑key值
    let same = child && oldFiber && child.type === oldFiber.type;

    let newFiber;
    if (same) {
      // 可以复用
      newFiber = {
        type: child.type,
        props: child.props, // 这个地方要存新的props
        stateNode: oldFiber.stateNode,
        base: oldFiber,
        return: workInProgress,
        effectTag: UPDATE
      };
    }
    if (!same && child) {
      // 节点插入
      newFiber = {
        type: child.type,
        props: child.props,
        stateNode: null,
        base: null,
        return: workInProgress,
        effectTag: PLACEMENT
      };
    }

    if (!same && oldFiber) {
      // 删除
      oldFiber.effectTag = DELETION;
      deletions.push(oldFiber);
    }

    // 相当于指针，指向下一位
    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    if (i === 0) {
      workInProgress.child = newFiber;
    } else {
      prevSibling.sibling = newFiber;
    }
    prevSibling = newFiber;
  }
}

function performUnitOfWork(fiber) {
  // 任务1： 执行更新fiber
  const {type} = fiber;
  if (typeof type === "function") {
    type.prototype.isReactComponent
      ? updateClassComponent(fiber)
      : updateFunctionComponent(fiber);
  } else {
    updateHostComponent(fiber);
  }

  // 任务2： 返回下一个要更新的fiber
  //顺序是 子节点、兄弟、爸爸或者祖先的兄弟
  // 什么都没了，就更新完成了
  if (fiber.child) {
    return fiber.child;
  }
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.return;
  }
}

function workLoop(deadline) {
  // 当前有需要更新的fiber，并且浏览器有空闲时间
  while (nextUnitOfWork && deadline.timeRemaining() > 1) {
    // 执行更新fiber，并且返回下一个要更新的fiber
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }

  if (!nextUnitOfWork && wipRoot) {
    // 把fiber更新到根节点中，其实就是把vnode->node
    commitRoot();
  }

  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

function commitRoot() {
  deletions.forEach(commitWorker);
  commitWorker(wipRoot.child);
  currentRoot = wipRoot;
  wipRoot = null;
}

// parentNode.removeChild(fiberNode)
function commitDeletios(fiber, parentNode) {
  if (fiber.stateNode) {
    parentNode.removeChild(fiber.stateNode);
  } else {
    commitDeletios(fiber.child, parentNode);
  }
}

function commitWorker(fiber) {
  if (!fiber) {
    return;
  }

  // ! 找到fiber.stateNode的父或者祖先DOM节点parentNode
  let parentNodeFiber = fiber.return;
  while (!parentNodeFiber.stateNode) {
    parentNodeFiber = parentNodeFiber.return;
  }
  let parentNode = parentNodeFiber.stateNode;

  //  新增
  if (fiber.effectTag === PLACEMENT && fiber.stateNode) {
    parentNode.appendChild(fiber.stateNode);
  } else if (fiber.effectTag === UPDATE && fiber.stateNode) {
    // 更新属性
    updateNode(fiber.stateNode, fiber.base.props, fiber.props);
  } else if (fiber.effectTag === DELETION && fiber.stateNode) {
    // 更新属性
    commitDeletios(fiber, parentNode);
  }

  commitWorker(fiber.child);
  commitWorker(fiber.sibling);
}

// 返回最新的state和setState
// state和setState存在fiber（wipFiber）
// hook: {
// state: 状态值
// queue:[] //将要处理的状态值数组
// }
export function useState(init) {
  // 老的hook
  const oldHook = wipFiber.base && wipFiber.base.hooks[wipFiber.hookIndex];

  // 当前要返回的hook
  const hook = {
    state: oldHook ? oldHook.state : init, //存储状态值
    queue: oldHook ? oldHook.queue : [] // 存储要更新的状态值
  };

  // 模拟一下批量处理
  hook.queue.forEach(action => (hook.state = action));

  // state 、setState存到fiber上
  const setState = action => {
    hook.queue.push(action);
    wipRoot = {
      stateNode: currentRoot.stateNode,
      props: currentRoot.props,
      base: currentRoot
    };
    nextUnitOfWork = wipRoot;
    deletions = [];
  };

  wipFiber.hooks.push(hook);
  wipFiber.hookIndex++;

  return [hook.state, setState];
}

export default {render};
