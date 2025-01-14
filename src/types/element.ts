export type TProps = { [key: string]: any }; // props는 형태가 다양해서 any로 정의

export type TElement = string | TFunctionComponent<TProps>;

type TFunctionComponent<Props = {}> = (props: Props) => IChild<Props>;

export interface IChild<Props = {}> {
  type: TElement;
  props: Props;
}
