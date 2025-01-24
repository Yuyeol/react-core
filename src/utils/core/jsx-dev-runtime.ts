import { TVDOMType, TVDOMProps } from "@/types/vdom";

// 조건부 렌더링 등 불필요한 배열 구조를 가질 때 조건적으로 평탄화 작업을 진행
const flattenChildren = (children?: TVDOMType): TVDOMType[] => {
  if (children == null) return [];
  if (Array.isArray(children)) {
    return children
      .flatMap((child) => flattenChildren(child))
      .filter((child) => child != null);
  }
  return [children];
};

// jsx: 자식 요소가 없거나 하나일 때 사용
export const jsxDEV = (type: TVDOMType, props: TVDOMProps) => {
  const propsWithFlattenedChildren = {
    ...props,
    children: flattenChildren(props.children),
  };

  return {
    type,
    props: propsWithFlattenedChildren,
  };
};

// jsxs: 자식 요소가 여러 개일 때 사용
export function jsxsDEV(...args: Parameters<typeof jsxDEV>) {
  return jsxDEV(...args);
}
