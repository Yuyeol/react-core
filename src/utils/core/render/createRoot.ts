import { IVDOMNode, TVDOMProps } from "@/types/vdom";
import { root } from "@/utils/core/registry/root";
import { render } from "@/utils/core/render";
import { setupEventDelegation } from "@/utils/core/eventSystem";

export const createRoot = (
  component: () => IVDOMNode<TVDOMProps>,
  container: HTMLElement
) => {
  root.setRootElement(container);
  root.setCreateVDOM(component);
  setupEventDelegation(container);
  const vdom = component();
  root.setCurrentVDOM(vdom);
  render(vdom, container);
};
