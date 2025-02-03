import { IVDOMNode, TVDOMProps } from "@/types/vdom";
import createElementWithAttributes from "@/utils/core/render/createElementWithAttributes";
import { componentCaches } from "@/utils/core/registry/componentCaches";
import { isTextNode } from "@/utils/isTextNode";
import { getChildrenToArray } from "@/utils/getChildrenToArray";

const normalizeNode = (vdom: IVDOMNode<TVDOMProps>, path: number[]) => {
  if (typeof vdom.type === "string") return vdom;
  const result = vdom.type(vdom.props);
  componentCaches.setExecutedComponent(
    vdom.type.name,
    path,
    result,
    vdom.props
  );
  return result;
};
export function render(
  vdom: IVDOMNode<TVDOMProps>,
  container: HTMLElement,
  path: number[] = [0]
) {
  const normalizedNode = normalizeNode(vdom, path);

  // 엘리먼트 생성: 탑다운 순서로 진행
  const element = createElementWithAttributes(normalizedNode);

  if ("children" in normalizedNode.props) {
    const children = getChildrenToArray(normalizedNode.props.children);
    children.forEach((child, index) => {
      if (isTextNode(child))
        element.appendChild(document.createTextNode(String(child)));
      else render(child, element, [...path, index]);
    });
  }

  // 부모 엘리먼트에 추가: 바텀업 순서로 진행
  container.appendChild(element);
}
