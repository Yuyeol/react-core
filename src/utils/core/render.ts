import { IVDOMNode, TIntrinsicType, TVDOMProps, TVDOMType } from "@/types/vdom";

const isIntrinsic = (type: TVDOMType) => typeof type === "string";
const isTextNode = (node: IVDOMNode<TVDOMProps> | string) =>
  typeof node === "string" || typeof node === "number";

const createElementWithAttributes = (normalizedNode: IVDOMNode<TVDOMProps>) => {
  const element = document.createElement(normalizedNode.type as TIntrinsicType);
  Object.entries(normalizedNode.props || {}).forEach(([key, value]) => {
    if (key === "children") return;
    element.setAttribute(key, value as string);
  });
  return element;
};

const getChildrenToArray = <T>(children: T | T[]): T[] => {
  return Array.isArray(children) ? children : [children];
};

export function render(vdom: IVDOMNode<TVDOMProps>, container: HTMLElement) {
  const normalizedNode = isIntrinsic(vdom.type)
    ? vdom // intrinsic: 그대로 사용
    : vdom.type(vdom.props); // user-defined: 실행하여 intrinsic으로 변환

  // 엘리먼트 생성: 탑다운 순서로 진행
  const element = createElementWithAttributes(normalizedNode);

  if ("children" in normalizedNode.props) {
    const children = getChildrenToArray(normalizedNode.props.children);
    children.forEach((child) => {
      if (child === undefined) return;
      if (isTextNode(child))
        element.appendChild(document.createTextNode(child));
      else render(child, element);
    });
  }

  // 부모 엘리먼트에 추가: 바텀업 순서로 진행
  container.appendChild(element);
}
