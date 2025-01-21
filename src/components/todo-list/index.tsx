import { useState } from "@/utils/core/hooks";
import { IVDOMNode } from "@/types/vdom";
import Todo from "@/components/todo-list/todo";
import { ITodo } from "@/types/todo-list";

export default function TodoList(): IVDOMNode {
  const [todos, setTodos] = useState<ITodo[]>([]);
  const [input, setInput] = useState("");

  const inputText = (e: { target: HTMLInputElement }) => {
    setInput(e.target.value);
  };

  const addTodo = () => {
    if (!input.trim()) return;
    setTodos([...todos, { id: Date.now(), text: input, completed: false }]);
    setInput("");
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div>
      <h1>Todo List</h1>
      <div>
        <input type="text" value={input} onChange={inputText} />
        <button onClick={addTodo}>추가</button>
      </div>
      <ul>
        {todos.map((todo) => (
          <Todo
            key={todo.id}
            todo={todo}
            toggleTodo={toggleTodo}
            deleteTodo={deleteTodo}
          />
        ))}
      </ul>
    </div>
  );
}
