import { createEffect, createResource, createSignal, For } from "solid-js";
import { createStore } from "solid-js/store";
import { person } from "./obj";
const fetchTodos = async (num) => {
  const response = await person.axiosInstance.get(`/todos?_limit=${num}`);
  return response.data;
};

export const TodoList = () => {
  let input;
  const [todos, setTodos] = createStore([]);
  const [count, setCount] = createSignal(1);

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

  const [data] = createResource(count, fetchTodos);

  // Fetch initial todos using axios
  createEffect(async () => {
    try {
      if (data()) {
        const normalized = data().map((todo) => ({
          id: todo.id,
          text: todo.title,
          completed: todo.completed,
        }));
        setTodos(normalized);
      }
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
        <button onclick={() => setCount((c) => c + 10)}>Fetch more</button>
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
