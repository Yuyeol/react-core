## Mission1

### 목적

React의 JSX 변환 과정을 직접 구현하여 내부 동작 원리를 이해

### 핵심 로직: JSX 변환 함수

- `jsx-dev-runtime.ts`: React 17 이후 버전의 JSX 변환 로직
- `createElement.ts`: React 17 이전 버전의 JSX 변환 로직

## Mission2

### 목적

React의 렌더링 과정을 직접 구현, 상태를 활용한 TodoList 구현

### 핵심 로직

- `src/utils/core/render/index.ts`: 렌더링 함수
  - 재귀 호출을 통해 엘리먼트 생성 및 렌더링
  - 엘리먼트 속성 부여 시 이벤트 핸들러, 스타일, input 엘리먼트 속성 예외처리
- `src/utils/core/hooks/index.ts`: 상태 관리 함수
  - 복수개의 state 변경 시 배치 처리(queueMicrotask)
  - input의 포커스 관리를 위해 global.index 기반 엘리먼트 식별(WeakMap)

## Mission3

### 목적

React의 Reconciliation, 이벤트 시스템, useEffect 구현

### 핵심 로직

- `src/utils/core/render/rerender/reconcile.ts`: 리컨실 함수
  - render phase 처리: 트리 변경사항 추적하여 diffs 생성
- `src/utils/core/eventSystem/index.ts`: 이벤트 시스템 함수
  - DOM 이벤트 위임 처리(이벤트 버블링, SyntheticEvent)
- `src/utils/core/hooks/effect.ts`: 이펙트함수
  - 이펙트 함수 등록 및 실행
  - 라이프 사이클에 따른 동작 처리

## 설치 및 실행

```bash
# 패키지 설치
$ yarn

# 개발 모드 실행
$ yarn dev

# Babel 트랜스파일 결과 확인: dist/babel/
$ yarn babel-build
```
