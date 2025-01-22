import { ITodo } from "@/types/todo-list";

interface IProps {
  todo: ITodo;
  onToggleTodo: (id: number) => void;
  onDeleteTodo: (id: number) => void;
}

export default function TodoItem({ todo, onToggleTodo, onDeleteTodo }: IProps) {
  return (
    <li
      style={{
        textDecoration: todo.completed ? "line-through" : "none",
        color: todo.completed ? "#888" : "#000",
      }}
    >
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggleTodo(todo.id)}
      />
      <span>{todo.text}</span>
      <button onClick={() => onDeleteTodo(todo.id)}>삭제</button>
    </li>
  );
}
