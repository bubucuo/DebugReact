//下一个单元任务
let nextUnitOfWork = null;
// 正在工作的fiber
let wipRoot = null;
// 现在的根节点
let currentRoot = null;
let deletions = null;

let wipFiber = null;
let hookIndex = null;

function render(vnode, container) {
    // //vnode->node,把虚拟dom变成真实的dom
    // const node = createNode(vnode);
    // const { children } = vnode.props;
    // //遍历children
    // for (let i = 0; i < children.length; i++) {
    //     render(children[i], node);
    // }
    // // 更新container container.apppendChild(node)
    // container.appendChild(node);
    wipRoot = {
        node: container,
        props: { children: [vnode] },
        base: currentRoot
    };
    deletions = [];
    nextUnitOfWork = wipRoot;
}

function createNode(vnode) {
    const { type, props } = vnode;
    const node =
        type === "TEXT"
            ? document.createTextNode("")
            : document.createElement(type);
    updateNode(node, {}, props);
    return node;
}

function updateNode(node, prevVal, nextVal) {
    //规避children
    // 老的存在，取消
    // 新的存在， 新增
    Object.keys(prevVal)
        .filter(k => k !== "children")
        .filter(k => !(k in nextVal))
        .forEach(k => {
            if (k.slice(0, 2) === "on") {
                node.removeEventListener("click", nextVal[k], false);
            } else {
                node[k] = "";
            }
        });

    Object.keys(nextVal)
        .filter(k => k !== "children")
        .forEach(k => {
            if (k.slice(0, 2) === "on") {
                node.addEventListener("click", nextVal[k], false);
            } else {
                node[k] = nextVal[k];
            }
        });
}

function performUnitOfWork(fiber) {
    // 更新当前
    const { type } = fiber;
    const isFunctionComponent = type instanceof Function;
    if (isFunctionComponent) {
        type.isClassComponent
            ? updateClassComponent(fiber)
            : updateFunctionComponent(fiber);
    } else {
        updateHostComponent(fiber);
    }

    //找到下一个任务
    // 原则是：先找子元素
    if (fiber.child) {
        return fiber.child;
    }
    // 没有子元素，寻找兄弟元素
    let nextFiber = fiber;
    while (nextFiber) {
        if (nextFiber.sibling) {
            return nextFiber.sibling;
        }
        nextFiber = nextFiber.parent;
    }
}

function updateClassComponent(fiber) {
    const { type, props } = fiber;
    const cmp = new type(props);
    const children = [cmp.render()];
    reconcileChildren(fiber, children);
}

function updateFunctionComponent(fiber) {
    wipFiber = fiber;
    hookIndex = 0;
    wipFiber.hooks = [];
    const { type, props } = fiber;
    const children = [type(props)];
    reconcileChildren(fiber, children);
}

function updateHostComponent(fiber) {
    // 根据当前任务，获取下一个任务
    if (!fiber.node) {
        fiber.node = createNode(fiber);
    }
    reconcileChildren(fiber, fiber.props.children);
}

function reconcileChildren(workInProgressFiber, children) {
    // 构建fiber结构
    let oldFiber = workInProgressFiber.base && workInProgressFiber.base.child;
    let prevSibling = null;
    for (let i = 0; i < children.length; i++) {
        let child = children[i];
        let newFiber = null;
        const sameType = oldFiber && child && oldFiber.type === child.type;
        if (sameType) {
            // 类型一样 复用dom
            // update
            newFiber = {
                type: oldFiber.type,
                props: child.props,
                node: oldFiber.node,
                base: oldFiber,
                parent: workInProgressFiber,
                effectTag: "UPDATE"
            };
        }
        if (!sameType && child) {
            // 替换
            newFiber = {
                type: child.type,
                props: child.props,
                node: null,
                parent: workInProgressFiber,
                base: null,
                effectTag: "PLACEMENT"
            };
        }
        if (!sameType && oldFiber) {
            // 删除
            oldFiber.effectTag = "DELETION";
            deletions.push(oldFiber);
        }
        if (oldFiber) {
            oldFiber = oldFiber.sibling;
        }
        if (i === 0) {
            workInProgressFiber.child = newFiber;
        } else {
            prevSibling.sibling = newFiber;
        }
        prevSibling = newFiber;
        // fiber基本结构构建完成
    }
}

// 调度diff或者是渲染任务
function workLoop(deadline) {
    // 有下一个任务，并且当前帧还没有结束
    while (nextUnitOfWork && deadline.timeRemaining() > 1) {
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    }
    if (!nextUnitOfWork && wipRoot) {
        // 没有任务了，并且根节点还在
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
    if (fiber.effectTag === "PLACEMENT" && fiber.node !== null) {
        parentNode.appendChild(fiber.node);
    } else if (fiber.effectTag === "DELETION" && fiber.node !== null) {
        commitDeletions(fiber, parentNode);
    } else if (fiber.effectTag === "UPDATE" && fiber.node !== null) {
        updateNode(fiber.node, fiber.base.props, fiber.props);
    }
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

export function useState(init) {
    const oldHooks = wipFiber.base && wipFiber.base.hooks[hookIndex];
    const hook = {
        state: oldHooks ? oldHooks.state : init,
        queue: []
    };
    const actions = oldHooks ? oldHooks.queue : [];
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
