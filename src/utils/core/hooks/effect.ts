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
        global.setEffectAt(currentIndex, {
          callback,
          deps,
          cleanup: callback() || undefined,
        });
      },
    });
  } else {
    const prevEffect = global.getEffectAt(currentIndex);
    const prevDeps = prevEffect?.deps;

    if (shouldRerunEffect(prevDeps, deps)) {
      // 이펙트 실행전 이전 클린업이 있다면 먼저 실행
      updateSchedule({
        effect: () => {
          // 이펙트 실행과 동시에 클린업 수집
          global.setEffectAt(currentIndex, {
            callback,
            deps,
            cleanup: callback() || undefined,
          });
        },
      });
    }
  }
  global.incrementEffectIndex();
};

// // // 컴포넌트가 제거될 때 해당 컴포넌트의 모든 이펙트의 클린업을 실행해야 함
// export const cleanupComponentEffects = (componentIndex: number) => {
//   const effect = global.getEffectAt(componentIndex);
//   if (!effect) return;
//   if (effect.cleanup) effect.cleanup();
// };
