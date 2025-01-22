import { IVDOMNode, TIntrinsicType, TVDOMProps } from "@/types/vdom";
import { setFocusedElement } from "@/utils/core/hooks";
import { global } from "@/utils/core/hooks/global";

const createElementWithAttributes = (normalizedNode: IVDOMNode<TVDOMProps>) => {
  // create element
  const element = document.createElement(normalizedNode.type as TIntrinsicType);
  // set attributes
  Object.entries(normalizedNode.props || {}).forEach(([key, value]) => {
    if (key === "children") return;
    // event attributes: on[EventName]
    if (key.startsWith("on") && typeof value === "function") {
      const eventName = key.toLowerCase().slice(2);
      // onChange의 경우 "input" 이벤트를 사용하므로 예외처리
      if (eventName === "change" && element instanceof HTMLInputElement) {
        // WeakMap을 통해 포커스 엘리먼트 식별자(global.index) 저장
        setFocusedElement(element, global.getIndex());
        element.addEventListener("input", value);
      } else {
        element.addEventListener(eventName, value);
      }
      return;
    }
    // input attributes: checked, value
    if (key === "checked" && element instanceof HTMLInputElement) {
      element.checked = value as boolean;
      return;
    }
    if (key === "value" && element instanceof HTMLInputElement) {
      element.value = value as string;
      return;
    }
    // style attributes
    if (key === "style" && typeof value === "object") {
      Object.assign(element.style, value);
      return;
    }

    element.setAttribute(key, value as string);
  });
  return element;
};

export default createElementWithAttributes;
