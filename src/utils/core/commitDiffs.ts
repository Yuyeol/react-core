import { root } from "./rootManager";
import { updateAttributes } from "./render/createElementWithAttributes";
import { IDiffChange } from "./reconcile";
import { IVDOMNode, TPrimitiveNode, TVDOMProps } from "@/types/vdom";
import createElementWithAttributes from "./render/createElementWithAttributes";
const isPrimitiveNode = (
  node: IVDOMNode | TPrimitiveNode | null
): node is TPrimitiveNode => {
  return typeof node === "string" || typeof node === "number";
};
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

export const getParentElement = (path: number[]): HTMLElement | null => {
  if (path.length === 0) return root.getRootElement();
  return getElementByPath(path.slice(0, -1)) as HTMLElement;
};

export const createDOMNode = (
  node: IVDOMNode<TVDOMProps> | TPrimitiveNode
): HTMLElement | Text => {
  if (isPrimitiveNode(node)) {
    return document.createTextNode(String(node));
  }
  return createElementWithAttributes(node);
};

const renderChildren = (node: IVDOMNode<TVDOMProps>, element: HTMLElement) => {
  if (!node.props.children) return;

  const children = Array.isArray(node.props.children)
    ? node.props.children
    : [node.props.children];

  children.forEach((child) => {
    if (!child) return;

    if (isPrimitiveNode(child)) {
      element.appendChild(document.createTextNode(String(child)));
    } else {
      const childElement = createDOMNode(child);
      element.appendChild(childElement);
      if (!isPrimitiveNode(child)) {
        renderChildren(child, childElement as HTMLElement);
      }
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

        const newElement = createDOMNode(diff.newNode);
        if (!isPrimitiveNode(diff.newNode)) {
          renderChildren(diff.newNode, newElement as HTMLElement);
        }

        const index = diff.path[diff.path.length - 1];
        const nextSibling = parent.childNodes[index];

        if (nextSibling) {
          parent.insertBefore(newElement, nextSibling);
        } else {
          parent.appendChild(newElement);
        }
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
        if (!diff.newNode || isPrimitiveNode(diff.newNode)) return;
        const targetElement = getElementByPath(diff.path);
        if (!targetElement) return;

        // 이벤트 리스너 정리
        const oldProps =
          diff.oldNode && !isPrimitiveNode(diff.oldNode)
            ? diff.oldNode.props
            : {};
        Object.entries(oldProps).forEach(([key, value]) => {
          if (key.startsWith("on") && typeof value === "function") {
            const eventName = key.toLowerCase().slice(2);
            if (
              eventName === "change" &&
              targetElement instanceof HTMLInputElement
            ) {
              targetElement.removeEventListener("input", value);
            } else {
              targetElement.removeEventListener(eventName, value);
            }
          }
        });

        // 새로운 props 적용
        updateAttributes(targetElement, diff.newNode.props);
        break;
      }
    }
  });
};
