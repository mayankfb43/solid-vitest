import { For, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import axios from "axios";

export const TodoList = () => {
  let input;
  const [todos, setTodos] = createStore([]);

  const addTodo = (text) => {
    setTodos(todos.length, {
      id: todos.length + 1,
      text,
      completed: false,
    });
  };

  const toggleTodo = (id) => {
    const index = todos.findIndex((todo) => todo.id === id);
    if (index !== -1) {
      setTodos(index, "completed", (c) => !c);
    }
  };

  // Fetch initial todos using axios
  onMount(async () => {
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/todos?_limit=5"
      );
      const normalized = response.data.map((todo) => ({
        id: todo.id,
        text: todo.title,
        completed: todo.completed,
      }));
      setTodos(normalized);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  });

  return (
    <>
      <div>
        <input placeholder="new todo here" ref={input} />
        <button
          onClick={() => {
            if (!input.value.trim()) return;
            addTodo(input.value);
            input.value = "";
          }}
        >
          Add Todo
        </button>
      </div>
      <div>
        <For each={todos}>
          {(todo) => {
            const { id, text } = todo;
            return (
              <div role="listitem">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onchange={() => toggleTodo(id)}
                />
                <span
                  style={{
                    "text-decoration": todo.completed ? "line-through" : "none",
                  }}
                >
                  {text}
                </span>
              </div>
            );
          }}
        </For>
      </div>
    </>
  );
};
