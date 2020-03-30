import {ClassComponent, FunctionComponent} from "./CONST";

export function createFiber(returnFiber, vnode) {
  const {type, props} = vnode;
  const {children} = props;
  let tag;
  if (typeof type === "string") {
    tag = HostComponent;
  } else if (typeof type === "function") {
    tag = type.isReactComponent ? ClassComponent : FunctionComponent;
  } else {
    // console.log("ty", type, props, children); //sy-log
  }
  const created = {type, tag};
  created.parent = returnFiber;
  return created;
}

export function reconcileChildFibers(
  workInProgress,
  currentFirstChild,
  newChild
) {
  // console.log("reconcileChildFibers", newChild); //sy-log
  if (Array.isArray(newChild)) {
    return reconcileChildrenArray(workInProgress, currentFirstChild, newChild);
  } else {
    return reconcileSingleElement(workInProgress, currentFirstChild, newChild);
  }
}

export function reconcileChildrenArray(
  returnFiber,
  currentFirstChild,
  newChildren
) {
  console.log("reconcileChildrenArray", returnFiber, newChildren); //sy-log
  let resultingFirstChild = null;
  let newIdx = 0;
  let prevSibling = null;
  for (; newIdx < newChildren.length; newIdx++) {
    const newChild = newChildren[newIdx];
    const newFiber = createFiber(returnFiber, newChild);

    if (newIdx === 0) {
      returnFiber.child = newFiber;
    } else {
      prevSibling.sibling = newFiber;
    }
    prevSibling = newFiber;
  }

  return returnFiber.child; // resultingFirstChild;
}

export function reconcileSingleElement(returnFiber, child) {
  console.log("returnFiber", returnFiber); //sy-log
}

export function reconcileSingleTextNode(returnFiber, child) {}
