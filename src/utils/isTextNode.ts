import { IVDOMNode, TVDOMProps, TPrimitiveNode } from "@/types/vdom";

export const isTextNode = (
  node: IVDOMNode<TVDOMProps> | TPrimitiveNode | null
) => typeof node === "string" || typeof node === "number";
