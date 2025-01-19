// JSX 작성 시 필요한 타입
// 임시로 사용할 최소한의 속성만 정의
declare namespace JSX {
  interface ICommonHTMLAttributes {
    className?: string;
    children?: any;
    id?: string;
    style?: {
      [key: string]: string | number;
    };
  }

  interface IButtonHTMLAttributes extends ICommonHTMLAttributes {
    onClick?: () => void;
  }

  interface IntrinsicElements {
    header: ICommonHTMLAttributes;
    div: ICommonHTMLAttributes;
    h1: ICommonHTMLAttributes;
    p: ICommonHTMLAttributes;
    button: IButtonHTMLAttributes;
  }
}
