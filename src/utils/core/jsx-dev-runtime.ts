// 리액트 17 이후 버전 - runtime: 'automatic'
import { TVDOMType, TVDOMProps } from "@/types/vdom";

// jsx: 자식 요소가 없거나 하나일 때 사용
export const jsxDEV = (type: TVDOMType, props: TVDOMProps) => {
  return {
    type,
    props,
  };
};

// jsxs: 자식 요소가 여러 개일 때 사용
export function jsxsDEV(...args: Parameters<typeof jsxDEV>) {
  return jsxDEV(...args);
}
