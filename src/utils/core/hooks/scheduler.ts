import { rerender } from "@/utils/core/render/rerender";
import { global } from "@/utils/core/registry/hooks";
let stateQueue: (() => void)[] = [];
let effectQueue: (() => void)[] = [];
let isStateScheduled = false;
let isEffectScheduled = false;

export function updateSchedule({
  state,
  effect,
}: {
  state?: () => void;
  effect?: () => void;
}) {
  if (state) stateQueue.push(state);
  if (effect) effectQueue.push(effect);

  if (!isStateScheduled) {
    isStateScheduled = true;
    queueMicrotask(() => {
      stateQueue.forEach((update) => update());
      global.resetStateIndex();
      stateQueue = [];
      rerender();
      isStateScheduled = false;
    });
  }
  // 리렌더 완료 후 이펙트 실행
  if (!isEffectScheduled) {
    isEffectScheduled = true;
    queueMicrotask(() => {
      effectQueue.forEach((update) => update());
      global.resetEffectIndex();
      effectQueue = [];
      isEffectScheduled = false;
    });
  }
}
