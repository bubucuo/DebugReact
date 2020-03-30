import {PLACEMENT, UPDATE, DELETIONS, Fragment} from "./CONST";

// 下一个子任务
let nextUnitOfWork = null;
// work in progreess 工作中的fiber root
let wipRoot = null;

// 现在的根节点
let currentRoot = null;

// 当前正在工作的fiber
let wipFiber = null;
let hookIndex = null;
// 存放删除fiber的数组, 最后提交的时候进行统一提交，不要忘记每次进行初始化
let deletions = null;

// 初始化
function render(vnode, container) {
  wipRoot = {
    node: container,
    props: {children: [vnode]},
    base: currentRoot
  };
  deletions = [];
  nextUnitOfWork = wipRoot;
}

// 根据vnode，创建一个node
function createNode(vnode) {
  const {type, props} = vnode;
  let node;
  if (type === "TEXT") {
    node = document.createTextNode("");
  } else if (type) {
    node = document.createElement(type);
  }
  updateNode(node, {}, props);
  return node;
}

function deleteRemainingChildren(parentFiber, delFiber) {
  while (delFiber) {
    delFiber.effectTag = DELETIONS;
    deletions.push(delFiber);
    delFiber.props.children = [];
    delFiber.child = null;
    delFiber = delFiber.sibling;
  }
}

// 构建fiber结构，遍历workInProgressFiber的子节点
function reconcileChildren(workInProgressFiber, children) {
  // 构建fiber结构
  // 数组
  // 更新  删除 新增
  let prevSibling = null;
  let oldFiber = workInProgressFiber.base && workInProgressFiber.base.child;
  let lastPlacedIndex = 0;
  let newIdx = 0;
  let nextOldFiber;
  let len = children.length;
  for (; oldFiber && newIdx < len; newIdx++) {

    let child = children[newIdx];
    const sameType =
      child &&
      oldFiber &&
      child.type === oldFiber.type &&
      child.key === oldFiber.key;
    if (Array.isArray(child)) {
      child = {
        props: {children: child}
      };
    }
    if (oldFiber.index > newIdx) {
      nextOldFiber = oldFiber;
      oldFiber = null;
    } else {
      nextOldFiber = oldFiber.sibling;
    }
    let newFiber;
    if (sameType) {
      newFiber = {
        type: oldFiber.type, //类型 区分不同的fiber，比如说function class host等
        key: oldFiber.key,
        props: child.props, //属性参数等
        node: oldFiber.node, //真实dom节点
        base: oldFiber, //存储fiber，便于去比较
        parent: workInProgressFiber,
        effectTag: UPDATE
      };
    } else if (child) {
      newFiber = {
        type: child.type, //类型 区分不同的fiber，比如说function class host等
        key: child.key,
        props: child.props, //属性参数等
        node: null, //真实dom节点
        base: null, //存储fiber，便于去比较
        parent: workInProgressFiber,
        effectTag: PLACEMENT
      };
    } else {
      break;
    }

    if (!sameType && oldFiber && !oldFiber.base) {
      oldFiber.effectTag = DELETIONS;
      deletions.push(oldFiber);
    }
    if (newIdx === 0) {
      workInProgressFiber.child = newFiber;
    } else {
      prevSibling.sibling = newFiber;
      // sibling
    }
    prevSibling = newFiber;
    oldFiber = nextOldFiber;
  }
  if (oldFiber && newIdx === children.length) {
    deleteRemainingChildren(workInProgressFiber, oldFiber);
    return;
  }
  for (; !oldFiber && newIdx < children.length; newIdx++) {
    let child = children[newIdx];
    if (Array.isArray(child)) {
      child = {
        props: {children: child}
      };
    }
    let newFiber = null;
    // todo 比较 type key
    const sameType =
      child &&
      oldFiber &&
      child.type === oldFiber.type &&
      child.key === oldFiber.key;
    if (sameType) {
      // 复用 update
      newFiber = {
        type: oldFiber.type, //类型 区分不同的fiber，比如说function class host等
        key: oldFiber.key,
        props: child.props, //属性参数等
        node: oldFiber.node, //真实dom节点
        base: oldFiber, //存储fiber，便于去比较
        parent: workInProgressFiber,
        effectTag: UPDATE
      };
    }
    if (!sameType && child) {
      newFiber = {
        type: child.type, //类型 区分不同的fiber，比如说function class host等
        key: child.key,
        props: child.props, //属性参数等
        node: null, //真实dom节点
        base: null, //存储fiber，便于去比较
        parent: workInProgressFiber,
        effectTag: PLACEMENT
      };
    }
    newFiber.index = newIdx;
    if (!sameType && oldFiber) {
      // todo  删除
      // 有个删除数组， 每次push 打了删除tag的fiber进去，最后统一提交
      oldFiber.effectTag = DELETIONS;
      deletions.push(oldFiber);
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }
    // parent
    // child
    if (newIdx === 0) {
      workInProgressFiber.child = newFiber;
    } else {
      prevSibling.sibling = newFiber;
      // sibling
    }
    prevSibling = newFiber;
  }
}

// 更新节点上属性，如className、nodeValue等
function updateNode(node, prevVal, nextVal) {
  Object.keys(prevVal)
    .filter(k => k !== "children")
    .forEach(k => {
      if (k.slice(0, 2) === "on") {
        // 以on开头，就认为是一个事件，源码处理复杂一些，
        let eventName = k.slice(2).toLocaleLowerCase();
        node.removeEventListener(eventName, prevVal[k]);
      } else {
        if (!(k in nextVal)) {
          // 上一次的属性值出现过 下一次没有了 这个就需要置空
          node[k] = "";
        }
      }
    });

  Object.keys(nextVal)
    .filter(k => k !== "children")
    .forEach(k => {
      if (k.slice(0, 2) === "on") {
        // 以on开头，就认为是一个事件，源码处理复杂一些，
        let eventName = k.slice(2).toLocaleLowerCase();
        node.addEventListener(eventName, nextVal[k]);
      } else {
        node[k] = nextVal[k];
      }
    });
}

// function组件，构建fiber
function updateFunctionComponent(fiber) {
  wipFiber = fiber;
  wipFiber.hooks = [];
  hookIndex = 0;
  const {type, props} = fiber;
  const children = [type(props)];
  reconcileChildren(fiber, children);
}

// 更新class组件，构建fiber
function updateClassComponent(fiber) {
  const {type, props} = fiber;
  const cmp = new type(props);
  const children = [cmp.render()];
  reconcileChildren(fiber, children);
}

// 原生标签，，构建fiber
function updateHostComponent(fiber) {
  if (!fiber.node) {
    fiber.node = createNode(fiber);
  }
  const {children} = fiber.props;
  reconcileChildren(fiber, children);
}

// fragment标签，，构建fiber
function updateFragmentComponent(fiber) {
  const {children} = fiber.props;
  reconcileChildren(fiber, children);
}

// 执行当前任务，指定下一个任务，具体逻辑看下面实现及注释
function performUnitOfWork(fiber) {
  // 执行当前子任务
  // todo
  const {type} = fiber;

  if (typeof type === "function") {
    type.isReactComponent
      ? updateClassComponent(fiber)
      : updateFunctionComponent(fiber);
  } else if (type) {
    updateHostComponent(fiber);
  } else {
    updateFragmentComponent(fiber);
  }
  // 返回下一个子任务
  // 找到下个任务的原则：先找子元素
  if (fiber.child) {
    return fiber.child;
  }
  // 如果没有子元素，寻找兄弟元素
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }
  // return
}

// 看函数里具体注释
function workLoop(deadline) {
  // 执行子任务
  // 返回下一个子任务
  // ...
  while (nextUnitOfWork && deadline.timeRemaining() > 1) {
    //有下个子任务，并且当前帧还没有结束
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }

  // 没有子任务了，
  if (!nextUnitOfWork && wipRoot) {
    // 提交
    // commit
    commitRoot();
  }
  // 提交
  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

// 提交
function commitRoot() {
  deletions.forEach(commitWorker);
  commitWorker(wipRoot.child);
  currentRoot = wipRoot;
  wipRoot = null;
}

// 提交具体的fiber执行
function commitWorker(fiber) {
  if (!fiber) {
    return;
  }

  // 向上查找
  let parentNodeFiber = fiber.parent;
  while (!parentNodeFiber.node) {
    parentNodeFiber = parentNodeFiber.parent;
  }
  const parentNode = parentNodeFiber.node;
  // 更新 删除 新增
  if (fiber.effectTag === PLACEMENT && fiber.node !== null) {
    parentNode.appendChild(fiber.node);
  } else if (fiber.effectTag === UPDATE && fiber.node !== null) {
    updateNode(fiber.node, fiber.base.props, fiber.props);
  } else if (fiber.effectTag === DELETIONS && fiber.node !== null) {
    commitDeletions(fiber, parentNode);
  }
  commitWorker(fiber.child);

  if (!deletions.find(item => item === fiber.sibling)) {
    commitWorker(fiber.sibling);
  }
}

function commitDeletions(fiber, parentNode) {
  if (fiber.node) {
    parentNode.removeChild(fiber.node);
  } else {
    commitDeletions(fiber.child, parentNode);
  }
}

// init是初始值
export function useState(init) {
  //新旧
  const oldHook = wipFiber.base && wipFiber.base.hooks[hookIndex];
  const hook = {
    state: oldHook ? oldHook.state : init,
    queue: []
  };

  const actions = oldHook ? oldHook.queue : [];
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
  return [hook.state, setState];
}

export default {
  render
};
