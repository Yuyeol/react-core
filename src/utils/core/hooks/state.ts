import { global } from "@/utils/core/registry/hooks";
import { updateSchedule } from "@/utils/core/hooks/scheduler";

export function useState<T>(initialState: T): [T, (newState: T) => void] {
  const currentIndex = global.getStateIndex();

  if (global.getStateAt(currentIndex) === undefined) {
    global.setStateAt(currentIndex, initialState);
  }

  const setState = (newState: T) => {
    if (global.getStateAt(currentIndex) === newState) return;
    updateSchedule({
      state: () => {
        global.setStateAt(currentIndex, newState);
      },
    });
  };

  global.incrementStateIndex();
  return [global.getStateAt(currentIndex), setState];
}
