import { IVDOMNode, TPrimitiveNode, TVDOMProps } from "@/types/vdom";
import { componentCaches } from "@/utils/core/registry/componentCaches";
import { getChildrenToArray } from "@/utils/getChildrenToArray";
import { isTextNode } from "@/utils/isTextNode";
import { global } from "@/utils/core/registry/hooks";

export type TDiffType = "CREATE" | "UPDATE" | "DELETE" | "REPLACE";

export interface IDiffChange {
  type: TDiffType;
  newNode: IVDOMNode<TVDOMProps> | TPrimitiveNode | null;
  oldNode: IVDOMNode<TVDOMProps> | TPrimitiveNode | null;
  path: number[];
}

// 두 props 객체를 비교
const hasPropsChanged = (
  newProps: TVDOMProps,
  oldProps: TVDOMProps
): boolean => {
  const allKeys = new Set([...Object.keys(newProps), ...Object.keys(oldProps)]);
  for (const key of allKeys) {
    if (key === "children") return false;
    if (!Object.is(newProps[key], oldProps[key])) return true;
  }
  return false;
};

const normalizeNewNode = (
  vdom: IVDOMNode<TVDOMProps> | null,
  path: number[]
): IVDOMNode<TVDOMProps> | null => {
  if (!vdom) return null;
  if (typeof vdom.type === "function") {
    // 컴포넌트 실행 후 다음 리렌더를 위해 실행된 컴포넌트 캐싱
    const result = vdom.type(vdom.props);
    componentCaches.setExecutedComponent(
      vdom.type.name,
      path,
      result,
      vdom.props
    );
    return result;
  }
  return vdom;
};

const normalizeOldNode = (
  vdom: IVDOMNode<TVDOMProps> | null,
  path: number[]
): IVDOMNode<TVDOMProps> | null => {
  if (!vdom) return null;
  if (typeof vdom.type === "function") {
    // 캐싱된 컴포넌트 실행 결과 재사용
    const result = componentCaches.getExecutedComponent(
      vdom.type.name,
      path
    )?.result;
    return result ? result : null;
  }
  return vdom;
};

const reconcileTextNodes = (
  newNode: TPrimitiveNode | null,
  oldNode: TPrimitiveNode | null,
  path: number[]
): IDiffChange[] => {
  const diffs: IDiffChange[] = [];
  if (!newNode && oldNode)
    diffs.push({ type: "DELETE", oldNode: oldNode, newNode: null, path });
  else if (newNode && !oldNode)
    diffs.push({ type: "CREATE", newNode: newNode, oldNode: null, path });
  else if (newNode && oldNode && newNode !== oldNode)
    diffs.push({ type: "REPLACE", newNode: newNode, oldNode: oldNode, path });

  return diffs;
};

export const reconcile = (
  newVDOM: IVDOMNode<TVDOMProps> | null,
  oldVDOM: IVDOMNode<TVDOMProps> | null,
  path: number[] = []
): IDiffChange[] => {
  const diffs: IDiffChange[] = [];
  if (!oldVDOM && !newVDOM) return diffs;
  const oldNode = normalizeOldNode(oldVDOM, path);
  const newNode = normalizeNewNode(newVDOM, path);

  // CREATE, DELETE, REPLACE는 상호배타적 조건이므로 if-else 조건문 사용
  // 1. DELETE
  if (oldNode && !newNode) {
    // 컴포넌트 제거 시 이펙트 클린업 실행
    global.cleanupEffect();
    diffs.push({ type: "DELETE", newNode: null, oldNode: oldNode, path });
  }
  // 2. CREATE
  else if (!oldNode && newNode)
    diffs.push({ type: "CREATE", newNode: newNode, oldNode: null, path });
  // 3. REPLACE: 두 노드 모두 있고 타입이 다르면 교체
  else if (newNode && oldNode && newNode.type !== oldNode.type)
    diffs.push({ type: "REPLACE", newNode: newNode, oldNode: oldNode, path });

  if (!newNode || !oldNode) return diffs;
  // 4. UPDATE: 두 노드 모두 있고 타입이 같으면 props 비교
  if (newNode && oldNode && newNode.type === oldNode.type) {
    if (hasPropsChanged(newNode.props, oldNode.props))
      diffs.push({ type: "UPDATE", newNode: newNode, oldNode: oldNode, path });
  }

  // 5. children 비교 - 모든 케이스에 대해 마지막에 한 번만 처리
  if (newNode.props.children || oldNode.props.children) {
    const newChildren = getChildrenToArray(newNode.props.children || []);
    const oldChildren = getChildrenToArray(oldNode.props.children || []);

    for (let i = 0; i < Math.max(newChildren.length, oldChildren.length); i++) {
      const newChild = newChildren[i] || null;
      const oldChild = oldChildren[i] || null;
      if (isTextNode(newChild) && isTextNode(oldChild))
        diffs.push(...reconcileTextNodes(newChild, oldChild, [...path, i]));
      else diffs.push(...reconcile(newChild, oldChild, [...path, i]));
    }
  }

  return diffs;
};
