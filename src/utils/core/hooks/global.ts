import { IVDOMNode, TVDOMProps } from "@/types/vdom";

interface IGlobal {
  states: any[];
  index: number;
  rootElement: HTMLElement | null;
  rootComponent: (() => IVDOMNode<TVDOMProps>) | null;
}

const createGlobal = () => {
  const global: IGlobal = {
    states: [],
    index: 0,
    rootElement: null,
    rootComponent: null,
  };

  return {
    // 상태 관련
    getStateAt: (idx: number) => global.states[idx],
    setStateAt: (idx: number, value: any) => {
      global.states[idx] = value;
    },

    // 인덱스 관련
    getIndex: () => global.index,
    incrementIndex: () => {
      global.index++;
    },
    resetIndex: () => {
      global.index = 0;
    },

    // 루트 엘리먼트 관련
    getRootElement: () => {
      return global.rootElement as HTMLElement;
    },
    setRootElement: (element: HTMLElement) => {
      global.rootElement = element;
    },

    // 루트 컴포넌트 관련
    getRootComponent: () => global.rootComponent as () => IVDOMNode<TVDOMProps>,
    setRootComponent: (component: () => IVDOMNode<TVDOMProps>) => {
      global.rootComponent = component;
    },
  };
};

export const global = createGlobal();
