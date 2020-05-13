import {TEXT, PLACEMENT, UPDATE, DELETION} from "./const";

// 下一个子任务 fiber
let nextUnitOfWork = null;
//  work in progress fiber root
let wipRoot = null;

// 当前的根 fiber root
let currentRoot = null;

let deletions = null;

// fiber结构
/**
 * child
 * sibling
 * return
 * node dom节点
 * base 存储当前节点的上一次的fiber
 */

function render(vnode, container) {
  wipRoot = {
    node: container,
    props: {
      children: [vnode]
    },
    base: currentRoot
  };
  deletions = [];
  nextUnitOfWork = wipRoot;
}

function createNode(fiber) {
  const {type, props} = fiber;
  let node = null;
  if (type === TEXT) {
    node = document.createTextNode("");
  } else if (typeof type === "string") {
    node = document.createElement(type);
  }
  // else {
  //   node = document.createDocumentFragment();
  // }
  updateNode(node, {}, props);
  return node;
}

function updateNode(node, prevVal, nextVal) {
  // 旧的 className:'red'  style:{{color: 'red}}
  // 新的 style:{{color: 'pink}}
  Object.keys(prevVal)
    .filter(k => k !== "children")
    .forEach(k => {
      if (k.slice(0, 2) === "on") {
        // 简单处理 on开头当做事件
        let eventName = k.slice(2).toLowerCase();
        node.removeEventListener(eventName, prevVal[k]);
      } else {
        // 简单处理，如果需要考虑的style的话，需要再做处理，清空对象
        if (!(k in nextVal)) {
          node[k] = "";
        }
      }
    });

  Object.keys(nextVal)
    .filter(k => k !== "children")
    .forEach(k => {
      if (k.slice(0, 2) === "on") {
        // 简单处理 on开头当做事件
        let eventName = k.slice(2).toLowerCase();
        node.addEventListener(eventName, nextVal[k]);
      } else {
        node[k] = nextVal[k];
      }
    });
}

function placeChild(newFiber, lastPlacedIndex, newIdx, shouldTrackSideEffects) {
  newFiber.index = newIdx;
  if (!shouldTrackSideEffects) {
    return lastPlacedIndex;
  }
  let base = newFiber.base;
  const oldIndex = base.index;
  if (oldIndex < lastPlacedIndex) {
    newFiber.effectTag = PLACEMENT;
    return lastPlacedIndex;
  } else {
    return oldIndex;
  }
}

function mapRemainingChildren(returnFiber, currentFirstChild) {
  const existingChildren = new Map();
  let existingChild = currentFirstChild;
  while (existingChild) {
    if (existingChild.key) {
      existingChildren.set(existingChild.key, existingChild);
    } else {
      existingChildren.set(existingChild.index, existingChild);
    }
    existingChild = existingChild.sibling;
  }
  return existingChildren;
}

function reconcileChildren(workInProgressFiber, newChildren) {
  let oldFiber = workInProgressFiber.base && workInProgressFiber.base.child;
  let shouldTrackSideEffects = true;
  if (!oldFiber) {
    shouldTrackSideEffects = false;
  }
  let previousNewFiber = null;
  let prevSibling = null;
  let lastPlacedIndex = 0; // 记录上次插入的位置
  let newIdx = 0;
  let nextOldFiber = null;

  for (; oldFiber && newIdx < newChildren.length; newIdx++) {
    let child = newChildren[newIdx];
    if (oldFiber.index > newIdx) {
      nextOldFiber = oldFiber;
      oldFiber = null;
    } else {
      nextOldFiber = oldFiber.sibling;
    }

    if (child.type !== oldFiber.type || child.key !== oldFiber.key) {
      break;
    }
    const newFiber = {
      type: child.type,
      key: child.key,
      props: child.props,
      node: oldFiber.node,
      base: oldFiber, //存储当前节点上一次的值
      return: workInProgressFiber,
      effectTag: UPDATE
    };
    lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
    if (previousNewFiber === null) {
      workInProgressFiber.child = newFiber;
    } else {
      previousNewFiber.sibling = newFiber;
    }
    previousNewFiber = newFiber;
    oldFiber = nextOldFiber;
  }

  if (oldFiber === null) {
    // 重新渲染
    for (; newIdx < newChildren.length; newIdx++) {
      let child = newChildren[newIdx];
      const newFiber = {
        type: child.type,
        key: child.key,
        props: child.props,
        node: null,
        base: null,
        return: workInProgressFiber,
        effectTag: PLACEMENT
      };
      lastPlacedIndex = placeChild(
        newFiber,
        lastPlacedIndex,
        newIdx,
        shouldTrackSideEffects
      );
      if (previousNewFiber === null) {
        workInProgressFiber.child = newFiber;
      } else {
        previousNewFiber.sibling = newFiber;
      }
      previousNewFiber = newFiber;
    }
    return;
  }

  // Add all children to a key map for quick lookups.
  const existingChildren = mapRemainingChildren(workInProgressFiber, oldFiber);

  for (; newIdx < newChildren.length; newIdx++) {
    let child = newChildren[newIdx];
    let newFiber = {
      type: child.type,
      key: child.key,
      props: child.props,
      return: workInProgressFiber
    };
    const matchedFiber = existingChildren.get(
      child.key === null ? newIdx : child.key
    );
    if (matchedFiber) {
      // update
      newFiber = {
        ...newFiber,
        node: matchedFiber.node,
        base: matchedFiber, //存储当前节点上一次的值
        effectTag: UPDATE
      };

      shouldTrackSideEffects &&
        existingChildren.delete(child.key === null ? newIdx : child.key);
    } else {
      newFiber = {
        ...newFiber,
        node: null,
        base: null, //存储当前节点上一次的值
        effectTag: PLACEMENT
      };
    }

    lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
    if (previousNewFiber === null) {
      workInProgressFiber.child = newFiber;
    } else {
      previousNewFiber.sibling = newFiber;
    }
    previousNewFiber = newFiber;
  }

  if (shouldTrackSideEffects) {
    // 删除
    existingChildren.forEach(child => {
      oldFiber.effectTag = DELETION;
      deletions.push(child);
    });
  }
}

function reconcileChildren_(workInProgressFiber, children) {
  // 给children构建fiber架构
  let oldFiber = workInProgressFiber.base && workInProgressFiber.base.child;
  let prevSibling = null;
  let lastPlacedIndex = 0; // 记录上次插入的位置

  for (let i = 0; i < children.length; i++) {
    let child = children[i];
    let newFiber = null;
    const sameType = child && oldFiber && child.type === oldFiber.type;
    if (sameType) {
      // todo 类型相同 复用
      newFiber = {
        type: child.type,
        props: child.props,
        node: oldFiber.node,
        base: oldFiber, //存储当前节点上一次的值
        return: workInProgressFiber,
        effectTag: UPDATE
      };
    }
    if (!sameType && child) {
      // 类型不同 child存在  新增插入
      newFiber = {
        type: child.type,
        props: child.props,
        node: null,
        base: null,
        return: workInProgressFiber,
        effectTag: PLACEMENT
      };
    }

    if (!sameType && oldFiber) {
      // todo 删除
      oldFiber.effectTag = DELETION;
      deletions.push(oldFiber);
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    if (i === 0) {
      workInProgressFiber.child = newFiber;
    } else {
      // i>0
      prevSibling.sibling = newFiber;
    }
    prevSibling = newFiber;
  }
  // 基本构建完成 done
}

function updateHostComponent(fiber) {
  if (!fiber.node) {
    fiber.node = createNode(fiber);
  }
  const {children} = fiber.props;
  reconcileChildren(fiber, children);
}

function updateFunctionComponent(fiber) {
  wipFiber = fiber;
  wipFiber.hooks = [];
  hookIndex = 0;
  const {type, props} = fiber;
  const children = [type(props)];
  reconcileChildren(fiber, children);
}

function updateClassComponent(fiber) {
  const {type, props} = fiber;
  const cmp = new type(props);
  const children = [cmp.render()];
  reconcileChildren(fiber, children);
}

function peformUnitOfWork(fiber) {
  // 1. 执行当前任务
  const {type} = fiber;
  if (typeof type === "function") {
    type.isReactComponent
      ? updateClassComponent(fiber)
      : updateFunctionComponent(fiber);
  } else {
    // 原生标签
    updateHostComponent(fiber);
  }

  // 2. 返回下一个任务
  // 找到下一个任务 得有原则
  // 原则就是：先找子元素
  if (fiber.child) {
    return fiber.child;
  }
  // 原则2： 如没有子元素，寻找兄弟元素
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.return;
  }
}

function workLoop(deadline) {
  // 查找下一个任务，并且当前帧没有结束
  while (nextUnitOfWork && deadline.timeRemaining() > 1) {
    // 当前有任务
    nextUnitOfWork = peformUnitOfWork(nextUnitOfWork);
  }

  // 所有任务执行完成
  // todo commit
  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }

  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

// ! commit 阶段
function commitRoot() {
  deletions.forEach(commitWorker);
  commitWorker(wipRoot.child);
  currentRoot = wipRoot;
  wipRoot = null;
}

// 返回临近的下一个node;
function getHostSibling(fiber) {
  let sibling = fiber.return.child;

  while (sibling) {
    if (fiber.index + 1 === sibling.index && sibling.effectTag === UPDATE) {
      return sibling.node;
    }
    sibling = sibling.sibling;
  }
  return null;
}

function insertOrAppend(fiber, parentNode) {
  let node = fiber.node;
  let before = getHostSibling(fiber);
  if (before) {
    parentNode.insertBefore(node, before);
  } else {
    parentNode.appendChild(node);
  }
}

function commitWorker(fiber) {
  if (!fiber) {
    return;
  }

  // parentNodeFiber 指的是当前fiber的有node节点的父fiber或者祖先
  let parentNodeFiber = fiber.return;
  while (!parentNodeFiber.node) {
    parentNodeFiber = parentNodeFiber.return;
  }

  // parentNode是指分fiber的父node（当前fiber的父fiber可能没有node吗）
  const parentNode = parentNodeFiber.node;
  if (fiber.effectTag === PLACEMENT && fiber.node !== null) {
    // parentNode.appendChild(fiber.node);
    insertOrAppend(fiber, parentNode);
  } else if (fiber.effectTag === UPDATE && fiber.node !== null) {
    // 更新
    updateNode(fiber.node, fiber.base.props, fiber.props);
  } else if (fiber.effectTag === DELETION && fiber.node !== null) {
    // 更新
    commitDeletions(fiber, parentNode);
  }

  commitWorker(fiber.child);
  commitWorker(fiber.sibling);
}

// fiber是要删除的
function commitDeletions(fiber, parentNode) {
  if (fiber.node) {
    parentNode.removeChild(fiber.node);
  } else {
    commitDeletions(fiber.child, parentNode);
  }
}

// 当前正在工作中的fiber， work in progress
let wipFiber = null;
let hookIndex = null;
export function useState(init) {
  // 状态值：初始值以及改变之后的值
  const oldHook = wipFiber.base && wipFiber.base.hooks[hookIndex];
  const hook = {state: oldHook ? oldHook.state : init, queue: []};

  const actions = oldHook ? oldHook.queue : [];
  actions.forEach(action => (hook.state = action));

  const setState = action => {
    hook.queue.push(action);
    wipRoot = {
      // ...currentRoot,
      node: currentRoot.node,
      props: currentRoot.props,
      base: currentRoot
    };
    deletions = [];
    nextUnitOfWork = wipRoot;
  };
  // [状态值，改变状态值的函数]
  wipFiber.hooks.push(hook);
  hookIndex++;
  return [hook.state, setState];
}

export default {
  render
};
