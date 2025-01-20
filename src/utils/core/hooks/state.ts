import { global } from "@/utils/core/hooks";
import { rerender } from "@/utils/core/hooks";

// 배치 업데이트를 위한 간단한 큐
let updateQueue: (() => void)[] = [];
let isUpdating = false;

export function useState<T>(initialState: T): [T, (newState: T) => void] {
  const currentIndex = global.index;

  if (global.states[currentIndex] === undefined) {
    global.states[currentIndex] = initialState;
  }

  const setState = (newState: T) => {
    if (global.states[currentIndex] === newState) return;
    updateQueue.push(() => {
      global.states[currentIndex] = newState;
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

  global.index++;
  return [global.states[currentIndex], setState];
}
