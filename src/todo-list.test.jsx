import { render, fireEvent } from "@solidjs/testing-library";
import axios from "axios";

import { TodoList } from "./todo-list";
import { vi } from "vitest";

describe("<TodoList />", () => {
  test("it will render an text input and a button", () => {
    const { getByPlaceholderText, getByText } = render(() => <TodoList />);
    expect(getByPlaceholderText("new todo here")).toBeInTheDocument();
    expect(getByText("Add Todo")).toBeInTheDocument();
  });

  test("it will add a new todo", async () => {
    const { getByPlaceholderText, getByText } = render(() => <TodoList />);
    const input = getByPlaceholderText("new todo here");
    const button = getByText("Add Todo");
    input.value = "test new todo";
    fireEvent.click(button);
    expect(input.value).toBe("");
    expect(getByText(/test new todo/)).toBeInTheDocument();
  });

  test("it will mark a todo as completed", async () => {
    const { getByPlaceholderText, findByRole, getByText } = render(() => (
      <TodoList />
    ));
    const input = getByPlaceholderText("new todo here");
    const button = getByText("Add Todo");
    input.value = "mark new todo as completed";
    fireEvent.click(button);
    const completed = await findByRole("checkbox");
    expect(completed?.checked).toBe(false);
    fireEvent.click(completed);
    expect(completed?.checked).toBe(true);
    const text = getByText("mark new todo as completed");
    expect(text).toHaveStyle({ "text-decoration": "line-through" });
  });

  test("api testing - renders 5 todo items", async () => {
    const mockData = {
      data: [
        {
          userId: 1,
          id: 1,
          title: "delectus aut autem",
          completed: false,
        },
        {
          userId: 1,
          id: 2,
          title: "quis ut nam facilis et officia qui",
          completed: false,
        },
        {
          userId: 1,
          id: 3,
          title: "fugiat veniam minus",
          completed: false,
        },
        {
          userId: 1,
          id: 4,
          title: "et porro tempora",
          completed: true,
        },
        {
          userId: 1,
          id: 5,
          title:
            "laboriosam mollitia et enim quasi adipisci quia provident illum",
          completed: false,
        },
      ],
    };
    axios.get = vi.fn();
    axios.get.mockResolvedValue(mockData);

    const { findAllByRole } = render(() => <TodoList />);

    // Assuming each item renders as <li> or similar role
    const items = await findAllByRole("listitem");

    expect(items).toHaveLength(5);
  });
});
