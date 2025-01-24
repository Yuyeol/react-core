import { useState } from "@/utils/core/hooks";
import { IVDOMNode } from "@/types/vdom";
import { ITodo } from "@/types/todo-list";
import TodoItem from "@/components/todo-list/todo-item";

export default function TodoList(): IVDOMNode {
  const [todos, setTodos] = useState<ITodo[]>([]);
  const [todoText, setTodoText] = useState("");

  const handleInputTodo = (e: { target: HTMLInputElement }) => {
    setTodoText(e.target.value);
  };

  const handleAddTodo = () => {
    if (!todoText.trim()) return;
    setTodos([...todos, { id: Date.now(), text: todoText, completed: false }]);
    setTodoText("");
  };

  const handleToggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleDeleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div>
      <h1>Todo List</h1>
      <div>
        <input type="text" value={todoText} onChange={handleInputTodo} />
        <button onClick={handleAddTodo}>추가</button>
      </div>
      <ul>
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggleTodo={handleToggleTodo}
            onDeleteTodo={handleDeleteTodo}
          />
        ))}
      </ul>
    </div>
  );
}
