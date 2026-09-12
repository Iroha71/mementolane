import { BrowserWindow, app, ipcMain } from "electron";
import path from "node:path";
import { unknown, z } from "zod";
import { getDb } from "./main/db/client";
import {
  getActiveTasks,
  getTaskById,
  insertTask,
  sendMessage,
  updateTask,
} from "./main/repositories/cardRepository";
import {
  cardRequestSchema,
  CardSchema,
  InsertTaskResult,
} from "./shared/cardSchema";

const devServerUrl = process.env.VITE_DEV_SERVER_URL;

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1080,
    height: 720,
    webPreferences: {
      preload: path.join(__dirname, "preloads", "index.js"),
    },
  });

  if (devServerUrl) {
    win.loadURL(devServerUrl);
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, "renderer", "index.html"));
  }
};

app.whenReady().then(() => {
  getDb();
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.handle("sendMessage", (_event, msg: string) => sendMessage(msg));
ipcMain.handle("getActiveTasks", () => getActiveTasks());
ipcMain.handle(
  "getTask",
  async (_event, id: unknown): Promise<CardSchema | null> => {
    const parsedId = z.number().int().safeParse(id);

    if (!parsedId.success) {
      return null;
    }

    return await getTaskById(parsedId.data);
  },
);
ipcMain.handle(
  "insertTask",
  async (_event, request: unknown): Promise<InsertTaskResult> => {
    const parsed = cardRequestSchema.safeParse(request);

    if (!parsed.success) {
      const { fieldErrors: rawFieldErrors } = z.flattenError(parsed.error);
      const fieldErrors = Object.fromEntries(
        Object.entries(rawFieldErrors)
          .filter(([, messages]) => messages && messages.length > 0)
          .map(([field, messages]) => [field, messages![0]]),
      );

      return { success: false, fieldErrors, staus: 422 };
    }

    try {
      const data = await insertTask(parsed.data);

      if (!data) {
        return {
          success: false,
          message: "タスクの登録に失敗しました。もう一度やり直してください。",
          staus: 200,
        };
      }

      return { success: true, data, status: 500 };
    } catch (err) {
      return {
        success: false,
        message:
          err instanceof Error
            ? err.message
            : "タスクの登録に失敗しました。もう一度やり直してください。",
        staus: 500,
      };
    }
  },
);
ipcMain.handle(
  "updateTask",
  async (
    _event,
    id: unknown,
    request: unknown,
  ): Promise<InsertTaskResult> => {
    const parsedId = z.number().int().safeParse(id);

    if (!parsedId.success) {
      return {
        success: false,
        message: "不正なIDです。",
        staus: 400,
      };
    }

    const parsed = cardRequestSchema.safeParse(request);
    if (!parsed.success) {
      const { fieldErrors: rawFieldErrors } = z.flattenError(parsed.error);
      const fieldErrors = Object.fromEntries(
        Object.entries(rawFieldErrors)
          .filter(([, messages]) => messages && messages.length > 0)
          .map(([field, messages]) => [field, messages![0]]),
      );

      return { success: false, fieldErrors, staus: 422 };
    }

    try {
      const data = await updateTask(parsedId.data, parsed.data);

      if (!data) {
        return {
          success: false,
          message: "タスクの更新に失敗しました。もう一度やり直してください。",
          staus: 200,
        };
      }

      return { success: true, data, status: 500 };
    } catch (err) {
      console.error(err);

      return {
        success: false,
        message:
          err instanceof Error
            ? err.message
            : "エラーが発生しました。もう一度やり直してください",
        staus: 500,
      };
    }
  },
);
