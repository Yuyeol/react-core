// JSX 작성 시 필요한 타입
declare namespace JSX {
  type CommonHTMLAttributes = HTMLAttributes<HTMLElement>;
  type ButtonHTMLAttributes = ButtonHTMLAttributes<HTMLButtonElement>;
  type InputHTMLAttributes = InputHTMLAttributes<HTMLInputElement>;

  // IntrinsicElements & IntrinsicAttributes: 컴파일러가 인식하는 네이밍이 정해진 인터페이스
  // 내장 요소(div, span, h1 등 기본 요소들)
  interface IntrinsicElements {
    header: CommonHTMLAttributes;
    div: CommonHTMLAttributes;
    span: CommonHTMLAttributes;
    h1: CommonHTMLAttributes;
    p: CommonHTMLAttributes;
    ul: CommonHTMLAttributes;
    li: CommonHTMLAttributes;
    button: ButtonHTMLAttributes;
    input: InputHTMLAttributes;
  }

  // JSX 전용 속성을 엘리먼트(Intrinsic, UserDefined 모두에 해당)에서 사용 할 수 있도록 별도로 추가
  interface IntrinsicAttributes {
    key?: string | number;
  }
}
