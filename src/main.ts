import { BrowserWindow, app, ipcMain, IpcMainInvokeEvent } from "electron";
import path from "node:path";
import { success, z } from "zod";
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
import { registEffort } from "./main/repositories/effortBlockRepository";
import {
  effortBlockRequest,
  type EffortBlock,
  type EffortBlockRequest,
} from "./shared/effortBlockSchema";
import { message } from "./shared/message";

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
      const { fieldErrors } = z.flattenError(parsed.error);

      return { success: false, fieldErrors, status: 422 };
    }

    try {
      const data = await insertTask(parsed.data);

      if (!data) {
        return {
          success: false,
          message: "タスクの登録に失敗しました。もう一度やり直してください。",
          status: 404,
        };
      }

      return { success: true, data, status: 200 };
    } catch (err) {
      return {
        success: false,
        message:
          err instanceof Error
            ? err.message
            : "タスクの登録に失敗しました。もう一度やり直してください。",
        status: 500,
      };
    }
  },
);
export const handleUpdateTask = async (
  _event: IpcMainInvokeEvent,
  id: unknown,
  request: unknown,
): Promise<InsertTaskResult> => {
  const parsedId = z.number().int().safeParse(id);

  if (!parsedId.success) {
    return {
      success: false,
      message: "不正なIDです。",
      status: 400,
    };
  }

  const parsed = cardRequestSchema.safeParse(request);
  if (!parsed.success) {
    const { fieldErrors } = z.flattenError(parsed.error);

    return { success: false, fieldErrors, status: 422 };
  }

  try {
    const data = await updateTask(parsedId.data, parsed.data);

    if (!data) {
      return {
        success: false,
        message: "タスクの更新に失敗しました。もう一度やり直してください。",
        status: 404,
      };
    }

    return { success: true, data, status: 200 };
  } catch (err) {
    console.error(err);

    return {
      success: false,
      message:
        err instanceof Error
          ? err.message
          : "エラーが発生しました。もう一度やり直してください",
      status: 500,
    };
  }
};

ipcMain.handle("updateTask", handleUpdateTask);
ipcMain.handle("registEffort", async (_event, request) => {
  console.log(`main.ts request ${request}`);
  const parsed = effortBlockRequest.safeParse(request);
  if (!parsed.success) {
    const { fieldErrors } = z.flattenError(parsed.error);

    return { success: false, fieldErrors, status: 422 };
  }

  try {
    const data = await registEffort(
      parsed.data.date,
      parsed.data.cardId,
      parsed.data.blockNumber,
    );
    console.log(`main.ts: ${data}`);
  } catch (err) {
    return {
      success: false,
      message:
        "データ登録時にエラーが発生しました。もう一度やり直してください。",
      status: 500,
    };
  }
});
