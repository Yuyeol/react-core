interface IGlobal {
  states: any[];
  index: number;
}

const createHookManager = () => {
  const global: IGlobal = {
    states: [],
    index: 0,
  };

  return {
    // 상태 관련
    getStateAt: (idx: number) => global.states[idx],
    setStateAt: (idx: number, value: any) => {
      global.states[idx] = value;
    },

    // 인덱스 관련
    getIndex: () => global.index,
    incrementIndex: () => {
      global.index++;
    },
    resetIndex: () => {
      global.index = 0;
    },
  };
};

export const global = createHookManager();
