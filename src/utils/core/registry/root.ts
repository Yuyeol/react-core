import { IVDOMNode, TVDOMProps } from "@/types/vdom";

interface IRoot {
  rootElement: HTMLElement | null;
  createVDOM: (() => IVDOMNode<TVDOMProps>) | null;
  currentVDOM: IVDOMNode<TVDOMProps> | null;
}

const createRootRegistry = () => {
  const rootManager: IRoot = {
    rootElement: null, // #app div element
    createVDOM: null, // new VDOM트리 생성 함수
    currentVDOM: null, // 현재 렌더링된 VDOM 트리
  };

  return {
    // 루트 엘리먼트 관련
    getRootElement: () => {
      return rootManager.rootElement as HTMLElement;
    },
    setRootElement: (element: HTMLElement) => {
      rootManager.rootElement = element;
    },

    // 루트 컴포넌트 관련
    getCreateVDOM: () => rootManager.createVDOM as () => IVDOMNode<TVDOMProps>,
    setCreateVDOM: (component: () => IVDOMNode<TVDOMProps>) => {
      rootManager.createVDOM = component;
    },
    getCurrentVDOM: () => rootManager.currentVDOM,
    setCurrentVDOM: (vdom: IVDOMNode<TVDOMProps>) => {
      rootManager.currentVDOM = vdom;
    },
  };
};

export const root = createRootRegistry();
