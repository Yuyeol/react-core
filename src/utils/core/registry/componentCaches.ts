import { IVDOMNode, TVDOMProps } from "@/types/vdom";

interface ComponentInstance {
  result: IVDOMNode<TVDOMProps>;
  props: TVDOMProps;
}

const createComponentCachesRegistry = () => {
  const instances = new Map<string, ComponentInstance>();

  return {
    getExecutedComponent: (name: string, path: number[]) => {
      const key = `${name}:${path.join(",")}`; // (예: "TodoItem:0,2")
      return instances.get(key);
    },

    setExecutedComponent: (
      name: string,
      path: number[],
      result: IVDOMNode<TVDOMProps>,
      props: TVDOMProps
    ) => {
      const key = `${name}:${path.join(",")}`;
      instances.set(key, { result, props });
    },
  };
};

export const componentCaches = createComponentCachesRegistry();
