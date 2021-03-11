// vnode 虚拟dom
// node 真实dom节点

import {Deletion, Placement, Update} from "./const";

// 根节点 fiber
let wipRoot = null;
let currentRoot = null;

function render(vnode, container) {
  wipRoot = {
    type: "div",
    props: {children: {...vnode}},
    stateNode: container,
  };
  nextUnitOfWork = wipRoot;
}

function isStringOrNumber(sth) {
  return typeof sth === "string" || typeof sth === "number";
}

// 根据vnode，生成node
function createNode(workInProgress) {
  let node = document.createElement(workInProgress.type);
  updateNode(node, {}, workInProgress.props);
  return node;
}

// 更新原生标签的属性，如className、href、id、（style、事件）等
function updateNode(node, prevVal, nextVal) {
  Object.keys(prevVal)
    // .filter(k => k !== "children")
    .forEach((k) => {
      if (k === "children") {
        // 有可能是文本
        if (isStringOrNumber(prevVal[k])) {
          node.textContent = "";
        }
      } else if (k.slice(0, 2) === "on") {
        const eventName = k.slice(2).toLocaleLowerCase();
        node.removeEventListener(eventName, prevVal[k]);
      } else {
        if (!(k in nextVal)) {
          node[k] = "";
        }
      }
    });

  Object.keys(nextVal)
    // .filter(k => k !== "children")
    .forEach((k) => {
      if (k === "children") {
        // 有可能是文本
        if (isStringOrNumber(nextVal[k])) {
          node.textContent = nextVal[k] + "";
        }
      } else if (k.slice(0, 2) === "on") {
        const eventName = k.slice(2).toLocaleLowerCase();
        node.addEventListener(eventName, nextVal[k]);
      } else {
        node[k] = nextVal[k];
      }
    });
}

// 原生标签
function updateHostComponent(workInProgress) {
  // 修身
  // 构建真实dom节点
  if (!workInProgress.stateNode) {
    workInProgress.stateNode = createNode(workInProgress);
  }
  // 齐家
  // 协调子节点
  reconcileChildren(workInProgress, workInProgress.props.children);
  console.log("workInProgress", workInProgress); //sy-log
}

// 文本
function updateTextCompoent(workInProgress) {
  if (!workInProgress.stateNode) {
    workInProgress.stateNode = document.createTextNode(workInProgress.props);
  }
}

function updateFunctionComponent(workInProgress) {
  // 当前正在工作的fiber以及hook的初始化
  currentlyRenderingFiber = workInProgress;
  currentlyRenderingFiber.memoizedState = null;
  workInProgressHook = null;

  const {type, props} = workInProgress;
  const children = type(props);
  reconcileChildren(workInProgress, children);
}

function updateClassComponent(workInProgress) {
  const {type, props} = workInProgress;
  const instance = new type(props);
  const children = instance.render();
  reconcileChildren(workInProgress, children);
}

function updateFragmentComponent(workInProgress) {
  reconcileChildren(workInProgress, workInProgress.props.children);
}

function deleteChild(returnFiber, childToDelete) {
  const last = returnFiber.lastEffect;

  if (last != null) {
    last.nextEffect = childToDelete;
    returnFiber.lastEffect = childToDelete;
  } else {
    returnFiber.firstEffect = returnFiber.lastEffect = childToDelete;
  }

  childToDelete.nextEffect = null;
  childToDelete.flags = Deletion;
}

function placeChild(shouldTrackSideEffects, newFiber, lastPlacedIndex, newIdx) {
  newFiber.index = newIdx;
  if (!shouldTrackSideEffects) {
    return lastPlacedIndex;
  }

  const current = newFiber.alternate;
  if (current !== null) {
    const oldIndex = current.index;
    if (oldIndex < lastPlacedIndex) {
      // 移动位置
      newFiber.flags = Placement;
      return lastPlacedIndex;
    } else {
      // 不移动
      return oldIndex;
    }
  } else {
    // 插入新增的节点
    newFiber.flags = Placement;
    return lastPlacedIndex;
  }
}

function reconcileChildren(workInProgress, children) {
  if (isStringOrNumber(children)) {
    return;
  }

  let newChildren = Array.isArray(children) ? children : [children];

  let previousNewFiber = null;
  let oldFiber = workInProgress.alternate && workInProgress.alternate.child;

  let shouldTrackSideEffects = oldFiber !== null;

  // 记录上一个插入位置
  let lastPlacedIndex = 0;
  let newIdx = 0;

  if (!oldFiber) {
    for (; newIdx < newChildren.length; newIdx++) {
      let child = newChildren[newIdx];
      // 插入
      let newFiber = {
        key: child.key,
        type: child.type, // 类型
        props: {...child.props}, // 属性
        stateNode: null, //如果是原生标签，代表dom节点，如果是类组件就代表实例
        child: null, // 第一个子节点 fiber
        sibling: null, // 下一个兄弟节点  fiber
        return: workInProgress, // 父节点
        alternate: null,
        flags: Placement,
      };

      if (isStringOrNumber(child)) {
        newFiber.props = child;
      }

      lastPlacedIndex = placeChild(
        shouldTrackSideEffects,
        newFiber,
        lastPlacedIndex,
        newIdx
      );

      if (previousNewFiber === null) {
        // 第一个子fiber
        workInProgress.child = newFiber;
      } else {
        previousNewFiber.sibling = newFiber;
      }
      previousNewFiber = newFiber;
    }
  }
}

// 最假的吧，但是做的也是遍历子节点
function _reconcileChildren(workInProgress, children) {
  if (isStringOrNumber(children)) {
    return;
  }

  let newChildren = Array.isArray(children) ? children : [children];

  let previousNewFiber = null;
  let oldFiber = workInProgress.alternate && workInProgress.alternate.child;
  // 1 2 3 4
  // 2 3 4
  for (let i = 0; i < newChildren.length; i++) {
    let child = newChildren[i];
    let same =
      child &&
      oldFiber &&
      // child.key === oldFiber.key &&
      child.type === oldFiber.type;

    let newFiber;
    if (same) {
      // 节点复用
      newFiber = {
        key: child.key,
        type: child.type, // 类型
        props: {...child.props}, // 属性
        stateNode: oldFiber.stateNode, //如果是原生标签，代表dom节点，如果是类组件就代表实例
        child: null, // 第一个子节点 fiber
        sibling: null, // 下一个兄弟节点  fiber
        return: workInProgress, // 父节点
        alternate: oldFiber,
        flags: Update,
      };
    }
    if (!same && child) {
      // 插入
      newFiber = {
        key: child.key,
        type: child.type, // 类型
        props: {...child.props}, // 属性
        stateNode: null, //如果是原生标签，代表dom节点，如果是类组件就代表实例
        child: null, // 第一个子节点 fiber
        sibling: null, // 下一个兄弟节点  fiber
        return: workInProgress, // 父节点
        alternate: null,
        flags: Placement,
      };
    }

    if (!same && oldFiber) {
      // 删除
      deleteChild(workInProgress, oldFiber);
    }

    if (isStringOrNumber(child)) {
      newFiber.props = child;
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    if (i === 0) {
      // 第一个子fiber
      workInProgress.child = newFiber;
    } else {
      previousNewFiber.sibling = newFiber;
    }
    previousNewFiber = newFiber;
  }
}

// fiber 数据结构
// type
// props
// key
// stateNode  如果是原生标签，代表dom节点，如果是类组件就代表实例
// child 第一个子节点
// sibling 下一个兄弟节点
// return 指向父节点
// alternate 上一次fiber

// work in progress 当前正在执行当中的
function performNextUnitWork(workInProgress) {
  // step1 执行当前任务
  const {type} = workInProgress;
  if (isStringOrNumber(type)) {
    // 原生标签
    updateHostComponent(workInProgress);
  } else if (typeof type === "function") {
    type.prototype.isReactComponent
      ? updateClassComponent(workInProgress)
      : updateFunctionComponent(workInProgress);
  } else if (typeof type === "undefined") {
    // 文本
    updateTextCompoent(workInProgress);
  } else {
    updateFragmentComponent(workInProgress);
  }

  // step2 并且要返回下一个任务 深度优先遍历
  if (workInProgress.child) {
    return workInProgress.child;
  }

  let nextFiber = workInProgress;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.return;
  }
}

// 下一个要执行的任务
let nextUnitOfWork = null; // fiber
function workLoop(IdleDeadline) {
  while (nextUnitOfWork && IdleDeadline.timeRemaining() > 1) {
    // 执行当前任务，并且要返回下一个任务
    nextUnitOfWork = performNextUnitWork(nextUnitOfWork);
  }

  // 没有任务就提交
  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }

  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

function commitRoot() {
  commitWorker(wipRoot.child);
  currentRoot = wipRoot;
  wipRoot = null;
}

function getParentNode(workInProgress) {
  // 更新自己
  let parentNodeFiber = workInProgress.return;

  while (!parentNodeFiber.stateNode) {
    parentNodeFiber = parentNodeFiber.return;
  }

  let parentNode = parentNodeFiber.stateNode;

  return parentNode;
}

function handleEffect(workInProgress) {
  if (!workInProgress.firstEffect) {
    return;
  }

  let effect = workInProgress.firstEffect;

  while (effect) {
    if (effect.flags & Deletion) {
      if (effect.stateNode) {
        getParentNode(effect).removeChild(effect.stateNode);
      }
    }

    effect = effect.nextEffect;
  }
}

function commitWorker(workInProgress) {
  if (!workInProgress) {
    return;
  }

  // 更新自己
  // let parentNodeFiber = workInProgress.return;

  // while (!parentNodeFiber.stateNode) {
  //   parentNodeFiber = parentNodeFiber.return;
  // }

  let parentNode = getParentNode(workInProgress); //parentNodeFiber.stateNode;
  if (workInProgress.flags & Placement && workInProgress.stateNode) {
    parentNode.appendChild(workInProgress.stateNode);
  } else if (workInProgress.flags & Update && workInProgress.stateNode) {
    updateNode(
      workInProgress.stateNode,
      workInProgress.alternate.props,
      workInProgress.props
    );
  }

  handleEffect(workInProgress);

  // 更新子节点
  commitWorker(workInProgress.child);
  //更新下一个兄弟节点
  commitWorker(workInProgress.sibling);
}

// 当前正在工作的fiber
let currentlyRenderingFiber = null;
// 当前正在工作的hook
let workInProgressHook = null;
// 1-》2-》3

// 一个hook
export function useState(initalState) {
  let hook;
  // 判断是否是组件初次渲染
  if (currentlyRenderingFiber.alternate) {
    // 不是初次渲染，是更新阶段
    currentlyRenderingFiber.memoizedState =
      currentlyRenderingFiber.alternate.memoizedState;
    if (workInProgressHook) {
      hook = workInProgressHook = workInProgressHook.next;
    } else {
      // 是第一个hook
      hook = workInProgressHook = currentlyRenderingFiber.memoizedState;
    }
  } else {
    // 初次渲染
    hook = {
      memoizedState: initalState, //状态值
      queue: [],
      next: null,
    };

    if (workInProgressHook) {
      // 不是第一个hook
      workInProgressHook = workInProgressHook.next = hook;
    } else {
      // 是第一个hook，挂到fiber节点上
      currentlyRenderingFiber.memoizedState = workInProgressHook = hook;
    }
  }

  // 模拟批量处理
  hook.queue.forEach((action) => (hook.memoizedState = action));

  const dispatch = (action) => {
    hook.queue.push(action);
    wipRoot = {
      type: currentRoot.type,
      stateNode: currentRoot.stateNode,
      props: currentRoot.props,
      alternate: currentRoot,
    };
    nextUnitOfWork = wipRoot;
  };

  return [hook.memoizedState, dispatch];
}

export default {render};
