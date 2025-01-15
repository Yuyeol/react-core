import { TElement, TProps } from "@/types/element";

// react 17 이전 버전 - runtime: 'classic'
export function createElement(
  type: TElement,
  props: TProps,
  ...children: TElement[]
) {
  return {
    type,
    props: {
      ...props,
      children: children.length === 1 ? children[0] : children,
    },
  };
}
