import { TVDOMProps } from "@/types/vdom";

interface ISyntheticEvent {
  nativeEvent: Event;
  currentTarget: HTMLElement; // 현재 이벤트가 발생한 엘리먼트
  target: HTMLElement; // 이벤트가 처음 발생한 엘리먼트
  type: string;
  preventDefault(): void;
  stopPropagation(): void;
}

type TEventHandler = (event: ISyntheticEvent) => void;

const normalizeEventName = (eventName: string) => {
  let normalizedEventName = eventName.toLowerCase().slice(2);
  if (normalizedEventName === "change") normalizedEventName = "input";
  return normalizedEventName;
};

const eventList = ["click", "input"];

// ex) 'click' : WeakMap(button1 : handler1)
const eventHandlers = new Map<string, WeakMap<HTMLElement, TEventHandler>>();

const addDelegatedEvent = (
  element: HTMLElement,
  eventName: string,
  handler: TEventHandler
) => {
  const normalizedEventName = normalizeEventName(eventName);
  let elementMap = eventHandlers.get(normalizedEventName);
  if (!elementMap) {
    elementMap = new WeakMap<HTMLElement, TEventHandler>();
    eventHandlers.set(normalizedEventName, elementMap);
  }
  elementMap.set(element, handler);
};

const removeDelegatedEvent = (element: HTMLElement, eventName: string) => {
  const normalizedEventName = normalizeEventName(eventName);
  const elementMap = eventHandlers.get(normalizedEventName);
  if (elementMap) elementMap.delete(element);
};

export const updateEventHandlers = (
  element: HTMLElement,
  newProps: TVDOMProps,
  oldProps: TVDOMProps = {}
) => {
  const allEventProps = new Set(
    [...Object.keys(newProps), ...Object.keys(oldProps)].filter((key) =>
      key.startsWith("on")
    )
  );

  allEventProps.forEach((propName) => {
    const newHandler = newProps[propName];
    const oldHandler = oldProps[propName];

    if (newHandler !== oldHandler) {
      if (oldHandler) removeDelegatedEvent(element, propName);
      if (newHandler) addDelegatedEvent(element, propName, newHandler);
    }
  });
};

export const setupEventDelegation = (rootElement: HTMLElement) => {
  eventList.forEach((eventName) => {
    rootElement.addEventListener(eventName, (e: Event) => {
      let target = e.target as HTMLElement;
      const elementMap = eventHandlers.get(eventName);
      if (!elementMap) return;
      // 이벤트 발생 지점에서 버블링(버블링 특성상 루트까지 모두 순회)
      while (target !== rootElement) {
        const handler = elementMap.get(target);
        if (handler) {
          // 핸들러에서 이벤트 객체를 이용할 수 있게 함
          handler({
            nativeEvent: e,
            currentTarget: target,
            target: e.target as HTMLElement,
            type: eventName,
            preventDefault: () => e.preventDefault(),
            stopPropagation: () => e.stopPropagation(),
          });
        }
        target = target.parentElement as HTMLElement;
      }
    });
  });
};
