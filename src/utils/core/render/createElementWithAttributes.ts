import { IVDOMNode, TIntrinsicType, TVDOMProps } from "@/types/vdom";
import { updateAttributes } from "@/utils/core/render/updateAttributes";
import { updateEventHandlers } from "@/utils/core/eventSystem";

const createElementWithAttributes = (normalizedNode: IVDOMNode<TVDOMProps>) => {
  // create element
  const element = document.createElement(normalizedNode.type as TIntrinsicType);
  // set attributes
  updateEventHandlers(element, normalizedNode.props);
  updateAttributes(element, normalizedNode.props);
  return element;
};

export default createElementWithAttributes;
