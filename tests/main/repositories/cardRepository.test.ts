import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockWhere, mockFrom, mockSelect } = vi.hoisted(() => {
  const mockWhere = vi.fn();
  const mockFrom = vi.fn(() => ({ where: mockWhere }));
  const mockSelect = vi.fn(() => ({ from: mockFrom }));
  return { mockWhere, mockFrom, mockSelect };
});

vi.mock("../../../src/main/db/client", () => ({
  getDb: vi.fn(() => ({ select: mockSelect })),
}));

import { getActiveTasks } from "../../../src/main/repositories/cardRepository";

describe("getActiveTasks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("isDone以外のタスクが配列で取得できる", async () => {
    const activeTasks = [
      { id: 1, title: "task1", status: "plan", isDone: false },
      { id: 2, title: "task2", status: "doing", isDone: false },
    ];
    mockWhere.mockResolvedValue(activeTasks);

    const result = await getActiveTasks();

    expect(result).toEqual(activeTasks);
  });

  it("isDoneのみのタスクが存在する場合、空の配列が取得される", async () => {
    const doneTasks = [
      { id: 1, title: "task1", status: "done", isDone: true },
      { id: 2, title: "task2", status: "done", isDone: true },
    ];
    mockWhere.mockResolvedValue(doneTasks.filter((task) => !task.isDone));

    const result = await getActiveTasks();

    expect(result).toEqual([]);
  });

  it("dbへの接続エラーが発生した場合、空の配列が取得される", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    mockWhere.mockRejectedValue(new Error("db connection error"));

    const result = await getActiveTasks();

    expect(result).toEqual([]);
  });
});
