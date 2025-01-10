declare namespace JSX {
  interface CommonHTMLAttributes {
    className?: string;
    children?: any;
    id?: string;
    style?: {
      [key: string]: string | number;
    };
  }

  interface IntrinsicElements {
    div: CommonHTMLAttributes;
    h1: CommonHTMLAttributes;
    p: CommonHTMLAttributes;
  }
}
