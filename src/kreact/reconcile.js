// 构建fiber结构，遍历workInProgressFiber的子节点
function reconcileChildren(workInProgressFiber, children) {
  // 构建fiber结构
  // 数组
  // 更新  删除 新增
  let prevSibling = null;
  let oldFiber = workInProgressFiber.base && workInProgressFiber.base.child;
  for (let i = 0; i < children.length; i++) {
    let child = children[i];
    let newFiber = null;
    // todo 比较 type key
    const sameType = child && oldFiber && child.type === oldFiber.type;
    if (sameType) {
      // 复用 update
      newFiber = {
        type: oldFiber.type, //类型 区分不同的fiber，比如说function class host等
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
        props: child.props, //属性参数等
        node: null, //真实dom节点
        base: null, //存储fiber，便于去比较
        parent: workInProgressFiber,
        effectTag: PLACEMENT
      };
    }
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
    if (i === 0) {
      workInProgressFiber.child = newFiber;
    } else {
      prevSibling.sibling = newFiber;
      // sibling
    }
    prevSibling = newFiber;
  }
}
