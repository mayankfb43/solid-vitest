import { render, fireEvent } from "@solidjs/testing-library";
import axios from "axios";
import { describe, expect, test } from "vitest";
import { TodoList } from "./todo-list";
import { vi } from "vitest";
import { add } from "./module";
import { person } from "./obj";
import { multiply, sum } from "./add";
import * as module from "./module";
vi.mock("./add", async () => {
  const actual = await vi.importActual("./add");
  return {
    ...actual,
    sum: vi.fn().mockResolvedValue(100), // only mock `sum`
    multiply: vi.fn().mockResolvedValue(200),
  };
});

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
    vi.spyOn(person.axiosInstance, "get").mockResolvedValue({
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
    });

    const { findAllByRole } = render(() => <TodoList />);
    const items = await findAllByRole("listitem");
    expect(person.axiosInstance.get).toHaveBeenCalled();
    expect(person.axiosInstance.get).toHaveBeenCalledWith("/todos?_limit=1");
    expect(items).toHaveLength(5);
  });

  test("mock module", async () => {
    vi.spyOn(person, "getName").mockResolvedValue("help");
    let result = await person.getName("test");
    expect(result).toBe("help");
    expect(person.getName).toHaveBeenCalled();
    expect(person.getName).toHaveBeenCalledWith("test");
  });

  test("mock module", async () => {
    let add2 = vi.spyOn(module, "add");
    let result = await add2(2, 3);
    expect(result).toBe(5);
  });

  test("mock add function", async () => {
    let result = await sum(1, 2);
    expect(result).toBe(100);

    let multiplyResult = await multiply(2, 4);
    expect(multiplyResult).toBe(200);
  });
});
