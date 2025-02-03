import { IVDOMNode, TVDOMProps } from "@/types/vdom";

interface ComponentInstance {
  result: IVDOMNode<TVDOMProps>;
  props: TVDOMProps;
}

const createComponentCachesRegistry = () => {
  const componentCaches = new Map<string, ComponentInstance>();

  return {
    getExecutedComponent: (name: string, path: number[]) => {
      const key = `${name}:${path.join(",")}`; // (예: "TodoItem:0,2")
      return componentCaches.get(key);
    },

    setExecutedComponent: (
      name: string,
      path: number[],
      result: IVDOMNode<TVDOMProps>,
      props: TVDOMProps
    ) => {
      const key = `${name}:${path.join(",")}`;
      componentCaches.set(key, { result, props });
    },
  };
};

export const componentCaches = createComponentCachesRegistry();
