import { global } from "@/utils/core/registry/hooks";
import { updateSchedule } from "@/utils/core/hooks/scheduler";

export function useState<T>(initialState: T): [T, (newState: T) => void] {
  const currentIndex = global.getIndex();

  if (global.getStateAt(currentIndex) === undefined) {
    global.setStateAt(currentIndex, initialState);
  }

  const setState = (newState: T) => {
    if (global.getStateAt(currentIndex) === newState) return;

    updateSchedule(() => {
      global.setStateAt(currentIndex, newState);
    });
  };

  global.incrementIndex();
  return [global.getStateAt(currentIndex), setState];
}
