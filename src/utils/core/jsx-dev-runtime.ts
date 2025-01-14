// 리액트 17 이후 버전
// 결과적으로 같은 로직이지만 babel은 두 케이스의 이름을 구분지어 사용
import { TElement, TProps } from "@/types/element";

const isFunctionComponent = (type: TElement) => {
  return typeof type === "function";
};

// jsx: 자식 요소가 없거나 하나일 때 Babel이 사용
export const jsxDEV = (type: TElement, props: TProps) => {
  if (isFunctionComponent(type))
    return {
      type: type,
      props: type(props).props,
    };
  return {
    type,
    props,
  };
};

// jsxs: 자식 요소가 여러 개일 때 Babel이 사용
export function jsxsDEV(...args: Parameters<typeof jsxDEV>) {
  return jsxDEV(...args);
}
