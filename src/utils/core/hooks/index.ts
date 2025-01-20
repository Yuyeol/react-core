import { IVDOMNode, TVDOMProps } from "@/types/vdom";
import { render } from "@/utils/core/render";

// React 모든 훅의 전역상태
export const global = {
  states: [] as any[],
  index: 0,
  rootElement: null as HTMLElement | null,
  rootComponent: null as (() => IVDOMNode<TVDOMProps>) | null,
};

export const createRoot = (
  component: () => IVDOMNode<TVDOMProps>,
  container: HTMLElement
) => {
  global.rootElement = container;
  global.rootComponent = component;
};

// focusable한 element가 가지고있는 state의 index를 함께 저장
// 이전 렌더링과 비교하여 동일 엘리먼트를 식별할 자료구조가 없어 WeakMap 사용
const focusedElement = new WeakMap<HTMLElement, number>();
export const setFocusedElement = (element: HTMLElement, index: number) => {
  focusedElement.set(element, index);
};

export const rerender = () => {
  // 루트생성 없이 jsx 사용 시 에러처리
  if (!global.rootElement || !global.rootComponent)
    throw new Error("Root element or component not initialized");

  // 리렌더링 전: 포커스된 인풋 엘리먼트 저장(일단은 인풋만 포커스 가능하다고 가정하고 작성)
  const focused = document.activeElement;

  // 원래는 변경된 루트와의 비교 반영이 정석이지만 여기서는 가볍게 초기화하는 것으로 구현
  global.rootElement.innerHTML = "";
  // hooks의 인덱스는 리렌더링 시 초기화 되지만, global의 index는 초기화 되지 않음
  // 따라서 hooks의 인덱스 재부여를 위해 리렌더링 시 인덱스만 초기화
  global.index = 0;
  render(global.rootComponent(), global.rootElement);

  // 리렌더링 후:
  // focusedElement에 해당하는 global index와 동일한 index를 가진 엘리먼트를 찾아 포커스
  // 참고: createElementWithAttributes에서 input에 한하여 global.index를 부여해주고 있음
  const stateIndex =
    focused instanceof HTMLInputElement ? focusedElement.get(focused) : null;
  if (stateIndex !== null) {
    const inputs = Array.from(global.rootElement.querySelectorAll("input"));
    const newInput = inputs.find(
      (input) => focusedElement.get(input) === stateIndex
    );
    newInput?.focus();
  }
};

export { useState } from "@/utils/core/hooks/state";
