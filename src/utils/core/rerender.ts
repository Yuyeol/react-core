import { root } from "@/utils/core/rootManager";
import { global } from "@/utils/core/hooks/hookManager";
import { reconcile } from "./reconcile";

export const rerender = () => {
  // 루트생성 없이 jsx 사용 시 에러처리
  if (!root.getRootElement()) throw new Error("Root element not initialized");

  const newVDOM = root.getCreateVDOM()();
  const oldVDOM = root.getCurrentVDOM();

  global.resetIndex();
  const diffs = reconcile(newVDOM, oldVDOM, []);
  // commitDiffs(diffs);
  root.setCurrentVDOM(newVDOM);
};
