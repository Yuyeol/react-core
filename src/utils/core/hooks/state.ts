import { global } from "@/utils/core/hooks/global";
import { rerender } from "@/utils/core/hooks";

// 배치 업데이트를 위한 간단한 큐
let updateQueue: (() => void)[] = [];
let isUpdating = false;

export function useState<T>(initialState: T): [T, (newState: T) => void] {
  const currentIndex = global.getIndex();

  if (global.getStateAt(currentIndex) === undefined) {
    global.setStateAt(currentIndex, initialState);
  }

  const setState = (newState: T) => {
    if (global.getStateAt(currentIndex) === newState) return;
    updateQueue.push(() => {
      global.setStateAt(currentIndex, newState);
    });
    isUpdating = true;
    queueMicrotask(() => {
      updateQueue.forEach((update) => {
        update();
      });

      updateQueue = [];
      rerender();
      isUpdating = false;
    });
  };

  global.incrementIndex();
  return [global.getStateAt(currentIndex), setState];
}
