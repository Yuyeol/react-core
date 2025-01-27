import { IVDOMNode, TVDOMProps } from "@/types/vdom";

interface ComponentInstance {
  result: IVDOMNode<TVDOMProps>;
  props: TVDOMProps;
}

const createComponentManager = () => {
  const instances = new Map<string, ComponentInstance>();

  return {
    getInstance: (name: string, path: number[]) => {
      const key = `${name}:${path.join(",")}`; // (예: "TodoItem:0,2")
      return instances.get(key);
    },

    setInstance: (
      name: string,
      path: number[],
      result: IVDOMNode<TVDOMProps>,
      props: TVDOMProps
    ) => {
      const key = `${name}:${path.join(",")}`;
      instances.set(key, { result, props });
    },

    hasPropsChanged: (
      name: string,
      path: number[],
      newProps: TVDOMProps
    ): boolean => {
      const instance = instances.get(`${name}:${path.join(",")}`);
      if (!instance) return true;

      return Object.entries(newProps).some(([key, value]) => {
        if (key === "children") return false;
        return instance.props[key] !== value;
      });
    },

    clear: () => instances.clear(),
  };
};

export const componentManager = createComponentManager();
