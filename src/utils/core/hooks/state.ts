import { global } from "@/utils/core/hooks";
import { rerender } from "@/utils/core/hooks";

export function useState<T>(initialState: T): [T, (newState: T) => void] {
  // 생성된 스테이트의 고유 인덱스
  const currentIndex = global.index;
  let currentState = global.states[currentIndex] ?? initialState;

  const setState = (newState: T) => {
    currentState = newState;
    global.states[currentIndex] = newState;
    rerender();
  };

  global.index++;
  return [currentState, setState];
}
