import { IVDOMNode, TVDOMProps } from "@/types/vdom";
import { render } from "@/utils/core/render";

// React 모든 훅의 전역상태
const global = {
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

const resetHookIndex = () => {
  // hooks의 인덱스는 리렌더링 시 초기회 되지만, global은 초기화 되지 않음
  // 따라서 hooks의 인덱스 재부여를 위해 리렌더링 시 인덱스만 초기화
  global.index = 0;
};

export const rerender = () => {
  // 초기 렌더 없이 jsx를 사용할 경우의 에러처리
  if (!global.rootElement || !global.rootComponent)
    throw new Error("Root element or component not initialized");
  global.rootElement.innerHTML = "";
  resetHookIndex();
  render(global.rootComponent(), global.rootElement);
};

export const useState = <T>(initialState: T): [T, (newState: T) => void] => {
  // 생성된 스테이트의 고유 인덱스
  const currentIndex = global.index;
  let currentState = global.states[currentIndex] ?? initialState;

  const setState = (newState: T) => {
    currentState = newState;
    console.log(currentState);
    global.states[currentIndex] = newState;
    rerender();
  };

  global.index++;
  return [currentState, setState];
};
