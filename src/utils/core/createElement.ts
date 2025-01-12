// react 17 이전 버전
export function createElement(
  type: string,
  props: Record<string, any>,
  ...children: any[]
) {
  return {
    type,
    props: {
      ...props,
      children: children.length === 1 ? children[0] : children,
    },
  };
}
