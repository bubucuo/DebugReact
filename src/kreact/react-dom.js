import {TEXT, PLACEMENT, UPDATE, DELETION} from "./const";

// 下一个任务 fiber
let nextUnitOfWork = null;

// work in progress
let wipRoot = null;

// 当前根节点
let currentRoot = null;

// 存储要删除的fiber
let deletions = null;
function render(vnode, container) {
  // console.log("vnode", vnode, container); //sy-log
  // vnode->node
  // const node = createNode(vnode, container);
  // container.appendChild(node);

  wipRoot = {
    node: container,
    props: {
      children: [vnode]
    },
    base: currentRoot
  };
  nextUnitOfWork = wipRoot;
  deletions = [];
}

// vnode->node 这个过程还要处理属性
function createNode(vnode, parentNode) {
  let node = null;
  // todo
  const {type, props} = vnode;
  if (type === TEXT) {
    node = document.createTextNode("");
  } else if (typeof type === "string") {
    node = document.createElement(type);
  } else if (typeof type === "function") {
    node = type.isReactComponent
      ? updateClassComponent(vnode, parentNode)
      : updateFunctionComponent(vnode, parentNode);
  } else {
    node = document.createDocumentFragment();
  }
  // reconcileChildren(props.children, node);
  updateNode(node, {}, props);
  return node;
}

function updateFunctionComponent(fiber) {
  wipFiber = fiber;
  // 整理我们实现为数组，源码中是链表
  wipFiber.hooks = [];
  hookIndex = 0;
  const {type, props} = fiber;
  const children = [type(props)];
  reconcileChildren(fiber, children);
}

function updateClassComponent(fiber) {
  const {type, props} = fiber;
  let cmp = new type(props);
  let vvnode = cmp.render();
  const children = [vvnode];
  reconcileChildren(fiber, children);
}

// 真实dom节点属性添加
function updateNode(node, prevVal, nextVal) {
  Object.keys(prevVal)
    .filter(k => k !== "children")
    .forEach(k => {
      if (k.slice(0, 2) === "on") {
        // ! 这里不是源码重点中的实现逻辑
        let evenetName = k.slice(2).toLowerCase();
        node.removeEventListener(evenetName, nextVal[k]);
      } else {
        if (!(k in nextVal)) {
          node[k] = "";
        }
      }
    });
  Object.keys(nextVal)
    .filter(k => k !== "children")
    .forEach(k => {
      if (k.slice(0, 2) === "on") {
        // ! 这里不是源码重点中的实现逻辑
        let evenetName = k.slice(2).toLowerCase();
        node.addEventListener(evenetName, nextVal[k]);
      } else {
        node[k] = nextVal[k];
      }
    });
}

// workInProgressFiber父fiber，children是个数组，
// 这个函数就是给workInProgressFiber添加child，再给child构建sibling，形成一个链表
function reconcileChildren_old(workInProgressFiber, children) {
  let prevSilbling = null;
  // 上一次的第一个子元素
  let oldFiber = workInProgressFiber.base && workInProgressFiber.base.child;
  for (let i = 0; i < children.length; i++) {
    let child = children[i];
    const sameType = child && oldFiber && child.type === oldFiber.type;
    let newFiber;
    if (sameType) {
      // 复用
      newFiber = {
        type: child.type,
        props: child.props,
        node: oldFiber.node,
        base: oldFiber,
        return: workInProgressFiber,
        effectTag: UPDATE
      };
    }
    if (!sameType && child) {
      // 类型不同 child存在 直接新增fiber插入
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
      // 删除
      oldFiber.effectTag = DELETION;
      deletions.push(oldFiber);
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    if (i === 0) {
      workInProgressFiber.child = newFiber;
    } else {
      prevSilbling.sibling = newFiber;
    }
    prevSilbling = newFiber;
  }
}

function placeChild(newFiber, lastPlacedIndex, newIdx, shouldTrackSideEffects) {
  newFiber.index = newIdx;
  if (!shouldTrackSideEffects) {
    // 初次渲染 不用考虑移动位置
    return lastPlacedIndex;
  }

  let base = newFiber.base;
  let oldIndex = base.index;
  if (oldIndex < lastPlacedIndex) {
    return lastPlacedIndex;
  } else {
    return oldIndex;
  }
}

function reconcileChildren(returnFiber, newChildren) {
  // 记录上一次的fiber 相当于上一节课的prevSilbling
  let previousNewFiber = null;

  let oldFiber = returnFiber.base && returnFiber.base.child;
  // 记录一下上次的插入位置
  let lastPlacedIndex = 0;
  //下标 遍历children
  let newIdx = 0;
  // 记录下一个oldFiber
  let nextOldFiber = null;
  let shouldTrackSideEffects = true;
  if (!oldFiber) {
    // 初次渲染
    shouldTrackSideEffects = false;
  }

  for (; oldFiber !== null && newIdx < newChildren.length; newIdx++) {
    if (oldFiber.index > newIdx) {
      nextOldFiber = oldFiber;
      oldFiber = null;
    } else {
      nextOldFiber = oldFiber.sibling;
    }
    let newChild = newChildren[newIdx];

    if (!(newChild.type === oldFiber.type && newChild.key === oldFiber.key)) {
      if (oldFiber === null) {
        oldFiber = nextOldFiber;
      }
      break;
    }

    const newFiber = {
      key: newChild.key,
      type: newChild.type,
      props: newChild.props,
      node: oldFiber.node,
      base: oldFiber,
      return: returnFiber,
      effectTag: UPDATE
    };

    if (shouldTrackSideEffects) {
      if (oldFiber && newFiber.base === null) {
        deletions.push({
          ...oldFiber,
          effectTag: DELETION
        });
      }
    }
    lastPlacedIndex = placeChild(
      newFiber,
      lastPlacedIndex,
      newIdx,
      shouldTrackSideEffects
    );
    if (previousNewFiber === null) {
      returnFiber.child = newFiber;
    } else {
      previousNewFiber.sibling = newFiber;
    }
    previousNewFiber = newFiber;
    oldFiber = nextOldFiber;
  }

  if (oldFiber === null) {
    for (; newIdx < newChildren.length; newIdx++) {
      let newChild = newChildren[newIdx];
      const newFiber = {
        key: newChild.key,
        type: newChild.type,
        props: newChild.props,
        node: null,
        base: null,
        return: returnFiber,
        effectTag: PLACEMENT
      };
      lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
      if (previousNewFiber === null) {
        returnFiber.child = newFiber;
      } else {
        previousNewFiber.sibling = newFiber;
      }
      previousNewFiber = newFiber;
    }
    return;
  }

  // {
  //   '1': {}
  // }
  // 2->3->4
  // [1,2,3]

  const existingChildren = mapRemainingChildren(returnFiber, oldFiber);
  for (; newIdx < newChildren.length; newIdx++) {
    let newChild = newChildren[newIdx];
    let newFiber = {
      key: newChild.key,
      type: newChild.type,
      props: newChild.props,
      return: returnFiber
    };
    const matchedFiber = existingChildren.get(
      newChild.key === null ? newIdx : newChild.key
    );
    if (matchedFiber) {
      newFiber = {
        ...newFiber,
        //! 这个地方课上的时候写成了oldFiber，但是匹配到的可以复用的是matchedFiber
        // !而oldFiber只是老链表的头结点，并不是匹配到复用的
        // !fixed
        node: matchedFiber.node,
        base: matchedFiber,
        effectTag: UPDATE
      };
      shouldTrackSideEffects &&
        existingChildren.delete(newChild.key === null ? newIdx : newChild.key);
    } else {
      newFiber = {
        ...newFiber,
        node: null,
        base: null,
        effectTag: PLACEMENT
      };
    }
    lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
    if (previousNewFiber === null) {
      returnFiber.child = newFiber;
    } else {
      previousNewFiber.sibling = newFiber;
    }
    previousNewFiber = newFiber;
  }

  if (shouldTrackSideEffects) {
    existingChildren.forEach(child =>
      deletions.push({
        ...child,
        effectTag: DELETION
      })
    );
  }
}

function mapRemainingChildren(returnFiber, currentFirstChild) {
  // Add the remaining children to a temporary map so that we can find them by
  // keys quickly. Implicit (null) keys get added to this set with their index
  // instead.
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

function updateHostComponent(fiber) {
  // todo  fiber结构
  // 1. 构建当前fiber，添加节点属性
  if (!fiber.node) {
    fiber.node = createNode(fiber);
  }

  // 2. 协调子元素，构建子元素的fiber架构
  const {children} = fiber.props;
  reconcileChildren(fiber, children);
}

function performUnitOfWork(fiber) {
  // 1.执行当前任务
  const {type} = fiber;
  if (typeof type === "function") {
    // todo
    type.isReactComponent
      ? updateClassComponent(fiber)
      : updateFunctionComponent(fiber);
  } else {
    // h5标签
    updateHostComponent(fiber);
  }

  // 2. 返回下一个任务
  // 返回下一个任务原则： 1). 有子元素返回子元素
  if (fiber.child) {
    return fiber.child;
  }
  // 2) 如果没有子元素，找兄弟元素
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.return;
  }
}

function workLoop(deadline) {
  while (nextUnitOfWork && deadline.timeRemaining() > 1) {
    // 执行下一个任务
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }

  if (!nextUnitOfWork && wipRoot) {
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
  let before = getHostSibling(fiber);
  let node = fiber.node;
  if (before) {
    parentNode.insertBefore(node, before);
  } else {
    parentNode.appendChild(node);
  }
}

function commitWorker(fiber) {
  // 因为 当前fiber是个链表， 后面执行自己调用自己commitWorker，加个出口，不然会死循环
  if (!fiber) {
    return;
  }
  let parentNodeFiber = fiber.return;
  while (!parentNodeFiber.node) {
    parentNodeFiber = parentNodeFiber.return;
  }
  let parentNode = parentNodeFiber.node;
  if (fiber.effectTag === PLACEMENT && fiber.node !== null) {
    // parentNode.appendChild(fiber.node);
    insertOrAppend(fiber, parentNode);
  } else if (fiber.effectTag === UPDATE && fiber.node !== null) {
    updateNode(fiber.node, fiber.base.props, fiber.props);
  } else if (fiber.effectTag === DELETION && fiber.node !== null) {
    commitDeletions(fiber, parentNode);
  }
  // todo 删除 更新
  commitWorker(fiber.child);
  commitWorker(fiber.sibling);
}

function commitDeletions(fiber, parentNode) {
  if (fiber.node) {
    parentNode.removeChild(fiber.node);
  } else {
    commitDeletions(fiber.child, parentNode);
  }
}

// work in progress 正在工作中的fiber ing
let wipFiber = null;
let hookIndex = null;
export function useState(init) {
  const oldHook = wipFiber.base && wipFiber.base.hooks[hookIndex];
  const hook = {
    state: oldHook ? oldHook.state : init,
    queue: []
  };

  const actions = oldHook ? oldHook.queue : [];
  // 这里模拟批量执行
  actions.forEach(action => {
    hook.state = action;
  });

  const setState = action => {
    hook.queue.push(action);
    wipRoot = {
      node: currentRoot.node,
      props: currentRoot.props,
      base: currentRoot
    };
    nextUnitOfWork = wipRoot;
    deletions = [];
  };

  wipFiber.hooks.push(hook);
  hookIndex++;
  // 初始化的时候返回的是init， 更新阶段是重新计算出来的参数值
  return [hook.state, setState];
}

export default {render};
