import { BrowserWindow, app, ipcMain } from "electron";
import path from "node:path";
import { z } from "zod";
import { getDb } from "./main/db/client";
import {
  getActiveTasks,
  insertTask,
  sendMessage,
} from "./main/repositories/cardRepository";
import { cardRequestSchema, InsertTaskResult } from "./shared/cardSchema";

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

      return { success: false, fieldErrors };
    }

    try {
      const data = await insertTask(parsed.data);

      if (!data) {
        return {
          success: false,
          message: "タスクの登録に失敗しました。もう一度やり直してください。",
        };
      }

      return { success: true, data };
    } catch (err) {
      return {
        success: false,
        message:
          err instanceof Error
            ? err.message
            : "タスクの登録に失敗しました。もう一度やり直してください。",
      };
    }
  },
);
