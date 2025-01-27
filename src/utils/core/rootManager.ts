import { IVDOMNode, TVDOMProps } from "@/types/vdom";

interface IRoot {
  rootElement: HTMLElement | null;
  rootComponent: (() => IVDOMNode<TVDOMProps>) | null;
}

const createRootManager = () => {
  const rootManager: IRoot = {
    rootElement: null,
    rootComponent: null,
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
    getRootComponent: () =>
      rootManager.rootComponent as () => IVDOMNode<TVDOMProps>,
    setRootComponent: (component: () => IVDOMNode<TVDOMProps>) => {
      rootManager.rootComponent = component;
    },
  };
};

export const root = createRootManager();

export const createRoot = (
  component: () => IVDOMNode<TVDOMProps>,
  container: HTMLElement
) => {
  root.setRootElement(container);
  root.setRootComponent(component);
};
