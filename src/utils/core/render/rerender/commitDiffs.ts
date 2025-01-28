import { root } from "@/utils/core/registry/root";
import { updateAttributes } from "@/utils/core/render/updateAttributes";
import { IDiffChange } from "@/utils/core/render/rerender/reconcile";
import { IVDOMNode, TPrimitiveNode, TVDOMProps } from "@/types/vdom";
import createElementWithAttributes from "@/utils/core/render/createElementWithAttributes";
import { isTextNode } from "@/utils/isTextNode";
import { getChildrenToArray } from "@/utils/getChildrenToArray";
import { updateEventHandlers } from "@/utils/core/eventSystem";

const getElementByPath = (path: number[]): HTMLElement | null => {
  let current = root.getRootElement();
  for (const index of path) {
    if (!current) return null;
    const children = Array.from(current.childNodes);
    if (!children[index]) return null;
    current = children[index] as HTMLElement;
  }

  return current;
};

const getParentElement = (path: number[]): HTMLElement | null => {
  if (path.length === 0) return root.getRootElement();
  return getElementByPath(path.slice(0, -1)) as HTMLElement;
};

const createDOMNode = (
  node: IVDOMNode<TVDOMProps> | TPrimitiveNode
): HTMLElement | Text => {
  if (isTextNode(node)) return document.createTextNode(String(node));
  return createElementWithAttributes(node);
};

const renderChildren = (node: IVDOMNode<TVDOMProps>, element: HTMLElement) => {
  if (!node.props.children) return;
  const children = getChildrenToArray(node.props.children);
  children.forEach((child) => {
    if (isTextNode(child))
      element.appendChild(document.createTextNode(String(child)));
    else {
      const childElement = createDOMNode(child);
      element.appendChild(childElement);
      if (!isTextNode(child))
        renderChildren(child, childElement as HTMLElement);
    }
  });
};

export const commitDiffs = (diffs: IDiffChange[]) => {
  diffs.forEach((diff) => {
    switch (diff.type) {
      case "CREATE": {
        if (!diff.newNode) return;
        const parent = getParentElement(diff.path);
        if (!parent) return;
        const newElement = createDOMNode(diff.newNode) as HTMLElement;
        if (!isTextNode(diff.newNode)) renderChildren(diff.newNode, newElement);
        const index = diff.path[diff.path.length - 1];
        const nextSibling = parent.childNodes[index];

        if (nextSibling) parent.insertBefore(newElement, nextSibling);
        else parent.appendChild(newElement);

        break;
      }
      case "DELETE": {
        const targetElement = getElementByPath(diff.path);
        if (!targetElement) return;
        targetElement.remove();
        break;
      }
      case "REPLACE": {
        if (!diff.newNode) return;
        const targetElement = getElementByPath(diff.path);
        if (!targetElement) return;
        const newElement = createDOMNode(diff.newNode);
        targetElement.replaceWith(newElement);
        break;
      }
      case "UPDATE": {
        if (!diff.newNode || isTextNode(diff.newNode)) return;
        const targetElement = getElementByPath(diff.path);
        if (!targetElement) return;
        // 이벤트 리스너 정리
        const oldProps =
          diff.oldNode && !isTextNode(diff.oldNode) ? diff.oldNode.props : {};
        updateEventHandlers(targetElement, diff.newNode.props, oldProps);
        updateAttributes(targetElement, diff.newNode.props);
        break;
      }
    }
  });
};
