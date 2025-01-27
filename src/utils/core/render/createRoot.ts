import { IVDOMNode, TVDOMProps } from "@/types/vdom";
import { root } from "@/utils/core/registry/root";
import { render } from "@/utils/core/render";

export const createRoot = (
  component: () => IVDOMNode<TVDOMProps>,
  container: HTMLElement
) => {
  root.setRootElement(container);
  root.setCreateVDOM(component);
  const vdom = component();
  root.setCurrentVDOM(vdom);
  render(vdom, container);
};
