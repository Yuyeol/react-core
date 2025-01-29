import { rerender } from "@/utils/core/render/rerender";
import { global } from "@/utils/core/registry/hooks";
let stateQueue: (() => void)[] = [];
let effectQueue: (() => void)[] = [];
let isScheduled = false;

export function updateSchedule({
  state,
  effect,
}: {
  state?: () => void;
  effect?: () => void;
}) {
  if (state) stateQueue.push(state);
  if (effect) effectQueue.push(effect);

  if (!isScheduled) {
    isScheduled = true;
    queueMicrotask(() => {
      try {
        // 1. 상태 업데이트가 있는 경우에만 처리
        if (stateQueue.length > 0) {
          const updates = [...stateQueue];
          stateQueue = [];
          updates.forEach((update) => update());
          global.resetStateIndex();
          rerender();
        }
        // 2. 이펙트 실행
        if (effectQueue.length > 0) {
          const effects = [...effectQueue];
          effectQueue = [];
          effects.forEach((effect) => effect());
          global.resetEffectIndex();
        }
      } finally {
        isScheduled = false;
      }
    });
  }
}
