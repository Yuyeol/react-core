import { render } from "@/utils/core/render";
import { root } from "@/utils/core/rootManager";
import { global } from "@/utils/core/hooks/hookManager";

export const rerender = () => {
  // 루트생성 없이 jsx 사용 시 에러처리
  if (!root.getRootElement() || !root.getRootComponent())
    throw new Error("Root element or component not initialized");

  root.getRootElement().innerHTML = "";
  global.resetIndex();
  render(root.getRootComponent()(), root.getRootElement());
};
