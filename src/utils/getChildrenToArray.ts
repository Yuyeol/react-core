export const getChildrenToArray = <T>(children: T | T[]): T[] => {
  return Array.isArray(children) ? children : [children];
};
