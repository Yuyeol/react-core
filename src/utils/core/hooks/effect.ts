import { global } from "@/utils/core/registry/hooks";
import { updateSchedule } from "@/utils/core/hooks/scheduler";

type TCleanupFunction = () => void;
type TEffectCallback = () => void | TCleanupFunction;
type TDependencyList = any[] | null;

export interface IEffect {
  callback: TEffectCallback;
  deps: TDependencyList;
  cleanup?: TCleanupFunction;
}

const shouldRerunEffect = (
  prevDeps: TDependencyList,
  nextDeps: TDependencyList
): boolean => {
  // deps 파라미터를 아예 전달하지 않은 경우 (매 렌더링마다 실행)
  if (prevDeps === null) return true;
  if (nextDeps === null) return true;
  // deps가 빈 배열인 경우 (마운트 시에만 실행)
  if (Array.isArray(nextDeps) && nextDeps.length === 0) return false;
  // deps 값 비교
  return prevDeps.some((dep, i) => !Object.is(dep, nextDeps[i]));
};

const isInitialRun = (currentIndex: number) => {
  return global.getEffectAt(currentIndex) === undefined;
};

export const useEffect = (
  callback: TEffectCallback,
  deps: TDependencyList = null
) => {
  const currentIndex = global.getEffectIndex();

  if (isInitialRun(currentIndex)) {
    console.log("initial run");
    updateSchedule({
      effect: () => {
        const cleanup = callback() || undefined;
        global.setEffectAt(currentIndex, {
          callback,
          deps,
          cleanup,
        });
      },
    });
  } else {
    const prevEffect = global.getEffectAt(currentIndex);
    const prevDeps = prevEffect?.deps;

    if (shouldRerunEffect(prevDeps, deps)) {
      updateSchedule({
        effect: () => {
          // 이펙트 실행전 이전 클린업이 있다면 먼저 실행
          if (prevEffect.cleanup) {
            prevEffect.cleanup();
          }
          // 이펙트 실행과 동시에 클린업 수집
          const cleanup = callback() || undefined;
          global.setEffectAt(currentIndex, {
            callback,
            deps,
            cleanup,
          });
        },
      });
    }
  }
  global.incrementEffectIndex();
};
