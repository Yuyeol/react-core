import { TVDOMProps } from "@/types/vdom";

export const updateAttributes = (element: HTMLElement, props: TVDOMProps) => {
  Object.entries(props).forEach(([key, value]) => {
    if (key === "children") return;
    // 이벤트 핸들러는 이벤트 시스템에서 처리
    if (key.startsWith("on") && typeof value === "function") return;
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
