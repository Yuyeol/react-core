import { createElement } from "@/utils/core/createElement";

export default function Child({ name }: { name: string }) {
  return <p>child: {name}</p>;
}
