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

function placeChild(
  shouldTrackSideEffects,
  newFiber,
  lastPlacedIndex,
  newIndex
) {
  newFiber.index = newIndex;
  if (!shouldTrackSideEffects) {
    return lastPlacedIndex;
  }
  const current = newFiber.alternate;
  if (current) {
    const oldIndex = current.index;
    if (oldIndex < lastPlacedIndex) {
      // 移动
      newFiber.flags = Placement;
      return lastPlacedIndex;
    } else {
      return oldIndex;
    }
  } else {
    newFiber.flags = Placement;
    return lastPlacedIndex;
  }
}

function updateSlot(returnFiber, oldFiber, newChild) {
  if (oldFiber === null) {
    return null;
  }
  if (isStringOrNumber(newChild)) {
    console.log("updateSlot omg");
    return;
  }

  if (typeof newChild === "object" && newChild !== null) {
    if (newChild.key === oldFiber.key) {
      let newFiber = {
        type: newChild.type, // 类型
        key: newChild.key,
        props: {...newChild.props}, // 属性
        stateNode: null,
        child: null, // 第一个子节点 fiber
        sibling: null, // 下一个兄弟节点  fiber
        return: returnFiber, // 父节点
        alternate: null,
        flags: Update,
      };
      if (newChild.type === oldFiber.type) {
        // 复用
        newFiber = {
          ...newFiber,
          stateNode: oldFiber.stateNode, //如果是原生标签，代表dom节点，如果是类组件就代表实例
          alternate: oldFiber,
          // flags: Update,
        };
      }
      return newFiber;
    }
  }

  return null;
}

function deleteRemainingChildren(returnFiber, currentFirstChild) {
  let childToDelete = currentFirstChild;
  while (currentFirstChild) {
    deleteChild(returnFiber, childToDelete);
    childToDelete = childToDelete.sibling;
  }
}

function mapRemainingChildren(returnFiber, currentFirstChild) {
  const existingChildren = new Map();

  let existingChild = currentFirstChild;
  while (existingChild) {
    if (existingChild.key !== null) {
      existingChildren.set(existingChild.key, existingChild);
    } else {
      existingChildren.set(existingChild.index, existingChild);
    }
    existingChild = existingChild.sibling;
  }
  return existingChildren;
}

function updateFromMap(existingChildren, returnFiber, newIndex, newChild) {
  if (!newChild) {
    return null;
  }

  const matchedFiber =
    existingChildren.get(newChild.key === null ? newIndex : newChild.key) ||
    null;

  if (matchedFiber === null) {
    // 新增
    const newFiber = {
      type: newChild.type, // 类型
      key: newChild.key,
      props: {...newChild.props}, // 属性
      stateNode: null,
      child: null, // 第一个子节点 fiber
      sibling: null, // 下一个兄弟节点  fiber
      return: returnFiber, // 父节点
      alternate: null,
      flags: Update,
    };

    return newFiber;
  }

  if (matchedFiber.type === newChild.type) {
    const newFiber = {
      type: newChild.type, // 类型
      key: newChild.key,
      props: {...newChild.props}, // 属性
      stateNode: matchedFiber.stateNode, //如果是原生标签，代表dom节点，如果是类组件就代表实例
      child: null, // 第一个子节点 fiber
      sibling: null, // 下一个兄弟节点  fiber
      return: returnFiber, // 父节点
      alternate: matchedFiber,
      flags: Update,
    };
    return newFiber;
  }

  return null;
}

function reconcileChildren(returnFiber, children) {
  if (isStringOrNumber(children)) {
    return;
  }

  let newChildren = Array.isArray(children) ? children : [children];

  let previousNewFiber = null;
  let oldFiber = (returnFiber.alternate && returnFiber.alternate.child) || null;
  const shouldTrackSideEffects = oldFiber !== null;
  let newIndex = 0;
  let lastPlacedIndex = 0;
  let nextOldFiber = null;
  // 1 2 3 4
  // 2 3 4

  for (; oldFiber !== null && newIndex < newChildren.length; newIndex++) {
    let child = newChildren[newIndex];

    if (oldFiber.index > newIndex) {
      console.log("omg2");
      nextOldFiber = oldFiber;
      oldFiber = null;
    } else {
      nextOldFiber = oldFiber.sibling;
    }

    const newFiber = updateSlot(returnFiber, oldFiber, child);

    if (newFiber == null) {
      if (oldFiber === null) {
        oldFiber = nextOldFiber;
      }
      break;
    }
    if (shouldTrackSideEffects) {
      if (oldFiber && newFiber.alternate === null) {
        deleteChild(returnFiber, oldFiber);
      }
    }

    lastPlacedIndex = placeChild(
      shouldTrackSideEffects,
      newFiber,
      lastPlacedIndex,
      newIndex
    );
    if (previousNewFiber === null) {
      returnFiber.child = newFiber;
    } else {
      previousNewFiber.sibling = newFiber;
    }
    previousNewFiber = newFiber;

    oldFiber = nextOldFiber;
  }

  if (newIndex === newChildren.length) {
    deleteRemainingChildren(returnFiber, oldFiber);
    return;
  }

  if (!oldFiber) {
    for (; newIndex < newChildren.length; newIndex++) {
      let child = newChildren[newIndex];
      if (child === null) {
        continue;
      }

      let newFiber = {
        type: child.type, // 类型
        key: child.key,
        props: {...child.props}, // 属性
        stateNode: null, //如果是原生标签，代表dom节点，如果是类组件就代表实例
        child: null, // 第一个子节点 fiber
        sibling: null, // 下一个兄弟节点  fiber
        return: returnFiber, // 父节点
        alternate: null,
        flags: Placement,
      };
      lastPlacedIndex = placeChild(
        shouldTrackSideEffects,
        newFiber,
        lastPlacedIndex,
        newIndex
      );

      if (previousNewFiber === null) {
        returnFiber.child = newFiber;
      } else {
        previousNewFiber.sibling = newFiber;
      }
      previousNewFiber = newFiber;
    }

    return;
  }

  const existingChildren = mapRemainingChildren(returnFiber, oldFiber);

  for (; oldFiber !== null && newIndex < newChildren.length; newIndex++) {
    let child = newChildren[newIndex];
    const newFiber = updateFromMap(
      existingChildren,
      returnFiber,
      newIndex,
      child
    );

    if (newFiber) {
      if (shouldTrackSideEffects) {
        if (newFiber.alternate) {
          existingChildren.delete(
            newFiber.key === null ? newIndex : newFiber.key
          );
        }
      }
      lastPlacedIndex = placeChild(
        shouldTrackSideEffects,
        newFiber,
        lastPlacedIndex,
        newIndex
      );
      if (previousNewFiber === null) {
        returnFiber.child = newFiber;
      } else {
        previousNewFiber.sibling = newFiber;
      }
      previousNewFiber = newFiber;
    }
  }

  if (shouldTrackSideEffects) {
    existingChildren.forEach((child) => deleteChild(returnFiber, child));
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

// 找到离的最近兄弟节点，往前插入
function getNextDomSibling(fiber) {
  let nextDomSibling = fiber.sibling;
  while (nextDomSibling) {
    if (nextDomSibling.flags & Update && nextDomSibling.stateNode) {
      return nextDomSibling;
    }
    nextDomSibling = nextDomSibling.sibling;
  }

  return null;
}

function commitWorker(workInProgress) {
  if (!workInProgress) {
    return;
  }

  let parentNode = getParentNode(workInProgress); //parentNodeFiber.stateNode;
  if (workInProgress.flags & Placement && workInProgress.stateNode) {
    if (wipRoot.alternate) {
      /**
       * 更新
       * 如果是更新阶段的插入，如果后面有节点是更新的，如果还用appendChild，就会导致顺序错误
       * 如： 0 1 3 4  -> 0 1 2 4 5
       * 这个时候节点3是删除，节点2是插入，如果依然使用appendChild插入节点末尾，
       * 那么因为节点4的复用将会变成 0 1 4 2 5
       * 这里我采用的办法是插入的时候，检查这个节点后有没有更新的节点，如果有那就找到，
       * 然后往前插入。
       */
      let nextDomSibling = getNextDomSibling(workInProgress);
      if (nextDomSibling) {
        parentNode.insertBefore(
          workInProgress.stateNode,
          nextDomSibling.stateNode
        );
      } else {
        parentNode.appendChild(workInProgress.stateNode);
      }
    } else {
      // 初次渲染
      parentNode.appendChild(workInProgress.stateNode);
    }
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
