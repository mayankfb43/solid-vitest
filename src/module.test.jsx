import { describe, it, expect, vi } from "vitest";

// 👇 mock the module
vi.mock("./module", () => ({
  add: vi.fn(() => 42), // You can return any mocked value
}));

import { add } from "./module"; // import AFTER mocking

describe("mock add function", () => {
  it("should return mocked value", () => {
    let result = add(1, 2);
    expect(result).toBe(42);
    expect(add).toHaveBeenCalledWith(1, 2);
    result = add(3, 2);
    expect(result).toBe(42);
    expect(add).toHaveBeenCalledWith(3, 2);

    expect(add).toHaveBeenCalledTimes(2);
  });
});
