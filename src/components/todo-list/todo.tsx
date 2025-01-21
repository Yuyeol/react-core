import { ITodo } from "@/types/todo-list";

interface IProps {
  todo: ITodo;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
}

export default function Todo({ todo, toggleTodo, deleteTodo }: IProps) {
  return (
    <li
      key={todo.id}
      style={{
        textDecoration: todo.completed ? "line-through" : "none",
        color: todo.completed ? "#888" : "#000",
      }}
    >
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => toggleTodo(todo.id)}
      />
      <span>{todo.text}</span>
      <button onClick={() => deleteTodo(todo.id)}>삭제</button>
    </li>
  );
}
