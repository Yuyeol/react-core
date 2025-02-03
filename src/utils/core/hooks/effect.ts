import { global } from "@/utils/core/registry/hooks";
import { updateSchedule } from "@/utils/core/hooks/scheduler";

type TCleanupFunction = () => void;
type TEffectCallback = () => void | TCleanupFunction;
// unknown read only
type TDependencyList = readonly unknown[];

export interface IEffect {
  callback: TEffectCallback;
  deps?: TDependencyList;
  cleanup?: TCleanupFunction;
}

const shouldRerun = (
  prevDeps: TDependencyList | undefined,
  nextDeps: TDependencyList | undefined
): boolean => {
  // deps 파라미터를 아예 전달하지 않은 경우 (매 렌더링마다 실행)
  if (prevDeps === undefined) return true;
  if (nextDeps === undefined) return true;
  // deps가 빈 배열인 경우 (마운트 시에만 실행)
  if (Array.isArray(nextDeps) && nextDeps.length === 0) return false;
  // deps 값 비교
  return prevDeps.some((dep, i) => !Object.is(dep, nextDeps[i]));
};

export const useEffect = (callback: TEffectCallback, deps: TDependencyList) => {
  const currentIndex = global.getEffectIndex();
  const prevEffect = global.getEffectAt(currentIndex);
  const shouldRun = !prevEffect || shouldRerun(prevEffect.deps, deps);

  if (shouldRun) {
    // 이펙트 실행전 이전 클린업이 있다면 먼저 실행
    if (prevEffect?.cleanup) prevEffect.cleanup();
    updateSchedule({
      effect: () => {
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

  // shouldRun과 관계없이 인덱스 재부여를 위해 실행
  global.incrementEffectIndex();
};
