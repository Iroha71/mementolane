import type { IpcMainInvokeEvent } from "electron";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { CardRequestSchema, CardSchema } from "../src/shared/cardSchema";

vi.mock("electron", () => ({
  app: {
    whenReady: vi.fn(() => ({ then: vi.fn() })),
    on: vi.fn(),
    quit: vi.fn(),
  },
  BrowserWindow: class {
    static getAllWindows() {
      return [];
    }
  },
  ipcMain: {
    handle: vi.fn(),
  },
}));

vi.mock("../src/main/repositories/cardRepository", () => ({
  getActiveTasks: vi.fn(),
  getTaskById: vi.fn(),
  insertTask: vi.fn(),
  sendMessage: vi.fn(),
  updateTask: vi.fn(),
}));

import { updateTask } from "../src/main/repositories/cardRepository";
import { handleUpdateTask } from "../src/main";

const mockedUpdateTask = vi.mocked(updateTask);

const fakeEvent = {} as IpcMainInvokeEvent;

const validRequest: CardRequestSchema = {
  title: "タスク",
  status: "plan",
  startAt: null,
  dueAt: null,
  detail: null,
  isDone: false,
};

const fakeCard: CardSchema = {
  id: 1,
  title: "タスク",
  status: "plan",
  startAt: null,
  dueAt: null,
  detail: null,
  isDone: false,
  createdAt: new Date(),
};

describe("handleUpdateTask", () => {
  beforeEach(() => {
    mockedUpdateTask.mockReset();
  });

  describe("idのバリデーション", () => {
    it.each([
      ["数字の文字列", "1"],
      ["小数", 1.5],
      ["null", null],
      ["undefined", undefined],
      ["真偽値", true],
    ])("idが%sの場合は不正なIDエラーになる", async (_label, invalidId) => {
      const result = await handleUpdateTask(
        fakeEvent,
        invalidId,
        validRequest,
      );

      expect(result).toEqual({
        success: false,
        message: "不正なIDです。",
        staus: 400,
      });
      expect(mockedUpdateTask).not.toHaveBeenCalled();
    });

    it("整数のidは有効と判定され、repositoryに渡される", async () => {
      mockedUpdateTask.mockResolvedValueOnce(fakeCard);

      await handleUpdateTask(fakeEvent, 1, validRequest);

      expect(mockedUpdateTask).toHaveBeenCalledWith(1, validRequest);
    });
  });

  describe("requestのバリデーション", () => {
    it("titleが未入力の場合はfieldErrorsが返り、repositoryは呼ばれない", async () => {
      const result = await handleUpdateTask(fakeEvent, 1, {
        ...validRequest,
        title: "",
      });

      expect(result).toEqual({
        success: false,
        fieldErrors: { title: "タスク名は必須です" },
        staus: 422,
      });
      expect(mockedUpdateTask).not.toHaveBeenCalled();
    });

    it("titleが31文字の場合はfieldErrorsが返る", async () => {
      const result = await handleUpdateTask(fakeEvent, 1, {
        ...validRequest,
        title: "あ".repeat(31),
      });

      expect(result).toEqual({
        success: false,
        fieldErrors: { title: "タスク名は30字以内で入力してください" },
        staus: 422,
      });
    });

    it("statusが未入力の場合はfieldErrorsが返る", async () => {
      const result = await handleUpdateTask(fakeEvent, 1, {
        ...validRequest,
        status: "",
      });

      expect(result).toEqual({
        success: false,
        fieldErrors: { status: "現在の状態は必須です" },
        staus: 422,
      });
    });

    it("startAtがyyyy-mm-dd形式でない場合はfieldErrorsが返る", async () => {
      const result = await handleUpdateTask(fakeEvent, 1, {
        ...validRequest,
        startAt: "2026/09/12",
      });

      expect(result).toEqual({
        success: false,
        fieldErrors: {
          startAt: "開始日はyyyy-mm-dd形式で入力してください",
        },
        staus: 422,
      });
    });

    it("複数フィールドが不正な場合は複数件のfieldErrorsが返る", async () => {
      const result = await handleUpdateTask(fakeEvent, 1, {
        ...validRequest,
        title: "",
        status: "",
      });

      expect(result).toEqual({
        success: false,
        fieldErrors: {
          title: "タスク名は必須です",
          status: "現在の状態は必須です",
        },
        staus: 422,
      });
    });
  });

  describe("正常系", () => {
    it("更新に成功した場合はsuccess: trueで結果を返す", async () => {
      mockedUpdateTask.mockResolvedValueOnce(fakeCard);

      const result = await handleUpdateTask(fakeEvent, 1, validRequest);

      expect(result).toEqual({ success: true, data: fakeCard, status: 500 });
    });

    it("該当レコードがない場合はsuccess: falseを返す", async () => {
      mockedUpdateTask.mockResolvedValueOnce(null);

      const result = await handleUpdateTask(fakeEvent, 1, validRequest);

      expect(result).toEqual({
        success: false,
        message: "タスクの更新に失敗しました。もう一度やり直してください。",
        staus: 200,
      });
    });

    it("repositoryが例外をスローした場合はそのメッセージを返す", async () => {
      mockedUpdateTask.mockRejectedValueOnce(new Error("DBエラー"));

      const result = await handleUpdateTask(fakeEvent, 1, validRequest);

      expect(result).toEqual({
        success: false,
        message: "DBエラー",
        staus: 500,
      });
    });

    it("Errorインスタンスでない例外の場合は既定のメッセージを返す", async () => {
      mockedUpdateTask.mockRejectedValueOnce("string error");

      const result = await handleUpdateTask(fakeEvent, 1, validRequest);

      expect(result).toEqual({
        success: false,
        message: "エラーが発生しました。もう一度やり直してください",
        staus: 500,
      });
    });
  });
});
