import { BrowserWindow, app, ipcMain } from "electron";
import path from "node:path";
import { getDb } from "./main/db/client";
import {
  getActiveTasks,
  sendMessage,
} from "./main/repositories/cardRepository";

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
