import { IVDOMNode, TIntrinsicType, TVDOMProps } from "@/types/vdom";

const createElementWithAttributes = (normalizedNode: IVDOMNode<TVDOMProps>) => {
  // create element
  const element = document.createElement(normalizedNode.type as TIntrinsicType);
  // set attributes
  updateAttributes(element, normalizedNode.props);
  return element;
};

export default createElementWithAttributes;

export const updateAttributes = (element: HTMLElement, props: TVDOMProps) => {
  Object.entries(props).forEach(([key, value]) => {
    if (key === "children") return;
    if (key.startsWith("on") && typeof value === "function") {
      let eventName = key.toLowerCase().slice(2);
      if (eventName === "change") eventName = "input";
      element.addEventListener(eventName, value);
      return;
    }
    if (element instanceof HTMLInputElement) {
      if (key === "checked") {
        element.checked = value as boolean;
        return;
      }
      if (key === "value") {
        element.value = value as string;
        return;
      }
    }
    if (key === "style" && typeof value === "object") {
      Object.assign(element.style, value);
      return;
    }
    element.setAttribute(key, value as string);
  });
};
