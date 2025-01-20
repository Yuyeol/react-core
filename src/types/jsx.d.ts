// JSX 작성 시 필요한 타입
// 임시로 사용할 최소한의 속성만 정의
declare namespace JSX {
  interface JSXAttributes {
    key?: string | number;
  }
  interface IntrinsicElements {
    header: HTMLAttributes<HTMLElement> & JSXAttributes;
    div: HTMLAttributes<HTMLElement> & JSXAttributes;
    span: HTMLAttributes<HTMLElement> & JSXAttributes;
    h1: HTMLAttributes<HTMLElement> & JSXAttributes;
    p: HTMLAttributes<HTMLElement> & JSXAttributes;
    ul: HTMLAttributes<HTMLElement> & JSXAttributes;
    li: HTMLAttributes<HTMLElement> & JSXAttributes;
    button: ButtonHTMLAttributes<HTMLButtonElement> & JSXAttributes;
    input: InputHTMLAttributes<HTMLInputElement> & JSXAttributes;
  }
}
