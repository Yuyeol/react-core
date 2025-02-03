export type TVDOMProps = { [key: string]: any }; // props는 형태가 다양해서 any로 정의

export type TUserDefinedType<Props = {}> = (props: Props) => IVDOMNode<Props>;
export type TIntrinsicType = string;
export type TVDOMType = TIntrinsicType | TUserDefinedType<TVDOMProps>;

export interface IVDOMNode<Props = {}> {
  type: TVDOMType;
  props: Props;
}

export type TPrimitiveNode = string | number;
