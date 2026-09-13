import path from "node:path";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { CardRequestSchema } from "../../../src/shared/cardSchema";
import * as schema from "../../../src/main/db/schema";

let sqlite: Database.Database;
let testDb: ReturnType<typeof drizzle<typeof schema>>;

vi.mock("../../../src/main/db/client", () => ({
  getDb: () => testDb,
}));

import {
  insertTask,
  updateTask,
} from "../../../src/main/repositories/cardRepository";

beforeEach(() => {
  sqlite = new Database(":memory:");
  testDb = drizzle(sqlite, { schema });

  migrate(testDb, {
    migrationsFolder: path.join(__dirname, "..", "..", "..", "drizzle"),
  });
});

afterEach(() => {
  sqlite.close();
});

const baseRequest: CardRequestSchema = {
  title: "タスク",
  status: "plan",
  startAt: null,
  dueAt: null,
  detail: null,
  isDone: false,
};

describe("insertTask", () => {
  it("正しい値で保存処理が実行される", async () => {
    const result = await insertTask(baseRequest);

    expect(result).not.toBeNull();
    expect(result?.id).toBeTypeOf("number");
    expect(result?.title).toBe(baseRequest.title);
    expect(result?.status).toBe(baseRequest.status);
    expect(result?.startAt).toBeNull();
    expect(result?.dueAt).toBeNull();
    expect(result?.detail).toBeNull();
    expect(result?.isDone).toBe(false);
    expect(result?.createdAt).toBeInstanceOf(Date);
  });

  describe("title(NOT NULL, text(30))の境界値", () => {
    it("1文字（最小値）で保存できる", async () => {
      const result = await insertTask({ ...baseRequest, title: "あ" });
      expect(result?.title).toBe("あ");
    });

    it("30文字（最大値）で保存できる", async () => {
      const title = "あ".repeat(30);
      const result = await insertTask({ ...baseRequest, title });
      expect(result?.title).toBe(title);
    });

    it("31文字（最大値超過）でもSQLiteは長さを強制しないため保存できる", async () => {
      const title = "あ".repeat(31);
      const result = await insertTask({ ...baseRequest, title });
      expect(result?.title).toBe(title);
    });

    it("nullの場合はNOT NULL制約違反で例外がスローされる", async () => {
      await expect(
        insertTask({ ...baseRequest, title: null as unknown as string }),
      ).rejects.toThrow();
    });
  });

  describe("status(NOT NULL, text(20))の境界値", () => {
    it("1文字（最小値）で保存できる", async () => {
      const result = await insertTask({ ...baseRequest, status: "a" });
      expect(result?.status).toBe("a");
    });

    it("20文字（最大値）で保存できる", async () => {
      const status = "a".repeat(20);
      const result = await insertTask({ ...baseRequest, status });
      expect(result?.status).toBe(status);
    });

    it("21文字（最大値超過）でもSQLiteは長さを強制しないため保存できる", async () => {
      const status = "a".repeat(21);
      const result = await insertTask({ ...baseRequest, status });
      expect(result?.status).toBe(status);
    });

    it("nullの場合はNOT NULL制約違反で例外がスローされる", async () => {
      await expect(
        insertTask({ ...baseRequest, status: null as unknown as string }),
      ).rejects.toThrow();
    });
  });

  describe("detail(nullable, text(200))の境界値", () => {
    it("空文字（最小値）で保存できる", async () => {
      const result = await insertTask({ ...baseRequest, detail: "" });
      expect(result?.detail).toBe("");
    });

    it("200文字（最大値）で保存できる", async () => {
      const detail = "あ".repeat(200);
      const result = await insertTask({ ...baseRequest, detail });
      expect(result?.detail).toBe(detail);
    });

    it("201文字（最大値超過）でもSQLiteは長さを強制しないため保存できる", async () => {
      const detail = "あ".repeat(201);
      const result = await insertTask({ ...baseRequest, detail });
      expect(result?.detail).toBe(detail);
    });

    it("nullの場合も保存できる", async () => {
      const result = await insertTask({ ...baseRequest, detail: null });
      expect(result?.detail).toBeNull();
    });
  });

  describe("startAt(nullable)の境界値", () => {
    it("nullの場合は保存できる", async () => {
      const result = await insertTask({ ...baseRequest, startAt: null });
      expect(result?.startAt).toBeNull();
    });

    it("日付文字列を指定すると保存できる", async () => {
      const result = await insertTask({
        ...baseRequest,
        startAt: "2026-09-09",
      });
      expect(result?.startAt).toBe("2026-09-09");
    });
  });

  describe("dueAt(nullable)の境界値", () => {
    it("nullの場合は保存できる", async () => {
      const result = await insertTask({ ...baseRequest, dueAt: null });
      expect(result?.dueAt).toBeNull();
    });

    it("日付文字列を指定すると保存できる", async () => {
      const result = await insertTask({
        ...baseRequest,
        dueAt: "2026-12-31",
      });
      expect(result?.dueAt).toBe("2026-12-31");
    });
  });

  describe("isDone(NOT NULL, boolean)の境界値", () => {
    it("trueで保存できる", async () => {
      const result = await insertTask({ ...baseRequest, isDone: true });
      expect(result?.isDone).toBe(true);
    });

    it("falseで保存できる", async () => {
      const result = await insertTask({ ...baseRequest, isDone: false });
      expect(result?.isDone).toBe(false);
    });
  });
});

describe("updateTask", () => {
  let baseId: number;

  beforeEach(async () => {
    const created = await insertTask(baseRequest);
    baseId = created!.id;
  });

  it("正しい値で更新処理が実行される", async () => {
    const updateRequest: CardRequestSchema = {
      title: "更新後タスク",
      status: "wip",
      startAt: "2026-01-01",
      dueAt: "2026-01-31",
      detail: "更新後の詳細",
      isDone: true,
    };

    const result = await updateTask(baseId, updateRequest);

    expect(result).not.toBeNull();
    expect(result?.id).toBe(baseId);
    expect(result?.title).toBe(updateRequest.title);
    expect(result?.status).toBe(updateRequest.status);
    expect(result?.startAt).toBe(updateRequest.startAt);
    expect(result?.dueAt).toBe(updateRequest.dueAt);
    expect(result?.detail).toBe(updateRequest.detail);
    expect(result?.isDone).toBe(true);
  });

  it("存在しないidを指定した場合はnullが返る", async () => {
    const result = await updateTask(baseId + 9999, baseRequest);
    expect(result).toBeNull();
  });

  describe("title(NOT NULL, text(30))の境界値", () => {
    it("1文字（最小値）で更新できる", async () => {
      const result = await updateTask(baseId, { ...baseRequest, title: "あ" });
      expect(result?.title).toBe("あ");
    });

    it("30文字（最大値）で更新できる", async () => {
      const title = "あ".repeat(30);
      const result = await updateTask(baseId, { ...baseRequest, title });
      expect(result?.title).toBe(title);
    });

    it("31文字（最大値超過）でもSQLiteは長さを強制しないため更新できる", async () => {
      const title = "あ".repeat(31);
      const result = await updateTask(baseId, { ...baseRequest, title });
      expect(result?.title).toBe(title);
    });

    it("nullの場合はNOT NULL制約違反で例外がスローされる", async () => {
      await expect(
        updateTask(baseId, { ...baseRequest, title: null as unknown as string }),
      ).rejects.toThrow();
    });
  });

  describe("status(NOT NULL, text(20))の境界値", () => {
    it("1文字（最小値）で更新できる", async () => {
      const result = await updateTask(baseId, { ...baseRequest, status: "a" });
      expect(result?.status).toBe("a");
    });

    it("20文字（最大値）で更新できる", async () => {
      const status = "a".repeat(20);
      const result = await updateTask(baseId, { ...baseRequest, status });
      expect(result?.status).toBe(status);
    });

    it("21文字（最大値超過）でもSQLiteは長さを強制しないため更新できる", async () => {
      const status = "a".repeat(21);
      const result = await updateTask(baseId, { ...baseRequest, status });
      expect(result?.status).toBe(status);
    });

    it("nullの場合はNOT NULL制約違反で例外がスローされる", async () => {
      await expect(
        updateTask(baseId, {
          ...baseRequest,
          status: null as unknown as string,
        }),
      ).rejects.toThrow();
    });
  });

  describe("detail(nullable, text(200))の境界値", () => {
    it("空文字（最小値）で更新できる", async () => {
      const result = await updateTask(baseId, { ...baseRequest, detail: "" });
      expect(result?.detail).toBe("");
    });

    it("200文字（最大値）で更新できる", async () => {
      const detail = "あ".repeat(200);
      const result = await updateTask(baseId, { ...baseRequest, detail });
      expect(result?.detail).toBe(detail);
    });

    it("201文字（最大値超過）でもSQLiteは長さを強制しないため更新できる", async () => {
      const detail = "あ".repeat(201);
      const result = await updateTask(baseId, { ...baseRequest, detail });
      expect(result?.detail).toBe(detail);
    });

    it("nullの場合も更新できる", async () => {
      const result = await updateTask(baseId, { ...baseRequest, detail: null });
      expect(result?.detail).toBeNull();
    });
  });

  describe("startAt(nullable)の境界値", () => {
    it("nullの場合は更新できる", async () => {
      const result = await updateTask(baseId, { ...baseRequest, startAt: null });
      expect(result?.startAt).toBeNull();
    });

    it("日付文字列を指定すると更新できる", async () => {
      const result = await updateTask(baseId, {
        ...baseRequest,
        startAt: "2026-09-09",
      });
      expect(result?.startAt).toBe("2026-09-09");
    });
  });

  describe("dueAt(nullable)の境界値", () => {
    it("nullの場合は更新できる", async () => {
      const result = await updateTask(baseId, { ...baseRequest, dueAt: null });
      expect(result?.dueAt).toBeNull();
    });

    it("日付文字列を指定すると更新できる", async () => {
      const result = await updateTask(baseId, {
        ...baseRequest,
        dueAt: "2026-12-31",
      });
      expect(result?.dueAt).toBe("2026-12-31");
    });
  });

  describe("isDone(NOT NULL, boolean)の境界値", () => {
    it("trueで更新できる", async () => {
      const result = await updateTask(baseId, { ...baseRequest, isDone: true });
      expect(result?.isDone).toBe(true);
    });

    it("falseで更新できる", async () => {
      const result = await updateTask(baseId, {
        ...baseRequest,
        isDone: false,
      });
      expect(result?.isDone).toBe(false);
    });
  });
});
