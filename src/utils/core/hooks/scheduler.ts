import { rerender } from "@/utils/core/hooks";

let updateQueue: (() => void)[] = [];
let isScheduled = false;

export function updateSchedule(update: () => void) {
  updateQueue.push(update);

  if (!isScheduled) {
    isScheduled = true;
    queueMicrotask(() => {
      updateQueue.forEach((update) => update());
      updateQueue = [];
      rerender();
      isScheduled = false;
    });
  }
}
