import { root } from "@/utils/core/registry/root";
import { commitDiffs } from "@/utils/core/render/rerender/commitDiffs";
import { reconcile } from "@/utils/core/render/rerender/reconcile";

export const rerender = () => {
  // 루트생성 없이 jsx 사용 시 에러처리
  if (!root.getRootElement()) throw new Error("Root element not initialized");

  const newVDOM = root.getCreateVDOM()();
  const oldVDOM = root.getCurrentVDOM();

  const diffs = reconcile(newVDOM, oldVDOM, [0]);
  commitDiffs(diffs);
  root.setCurrentVDOM(newVDOM);
};
