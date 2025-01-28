import { IEffect } from "@/utils/core/hooks/effect";

interface IGlobal {
  stateIndex: number;
  effectIndex: number;
  states: any[];
  effects: IEffect[];
  effectsByPath: Map<string, IEffect[]>;
}

const createHookRegistry = () => {
  const global: IGlobal = {
    stateIndex: 0,
    effectIndex: 0,
    states: [],
    effects: [],
    effectsByPath: new Map(),
  };

  return {
    getStates: () => global.states,
    getEffects: () => global.effects,
    // 상태 관련
    getStateAt: (index: number) => global.states[index],
    setStateAt: (index: number, value: any) => {
      global.states[index] = value;
    },
    // 인덱스 관련
    getStateIndex: () => global.stateIndex,
    incrementStateIndex: () => {
      global.stateIndex++;
    },
    resetStateIndex: () => {
      global.stateIndex = 0;
    },
    // effects 관련 메서드 추가 필요
    getEffectAt: (index: number) => global.effects[index],
    setEffectAt: (index: number, effect: IEffect) => {
      global.effects[index] = effect;
    },
    getEffectIndex: () => global.effectIndex,
    incrementEffectIndex: () => {
      global.effectIndex++;
    },
    resetEffectIndex: () => {
      global.effectIndex = 0;
    },
  };
};

export const global = createHookRegistry();
