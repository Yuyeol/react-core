export default function Child({ name }: { name?: string }) {
  return <p>child{name && `: ${name}`}</p>;
}
