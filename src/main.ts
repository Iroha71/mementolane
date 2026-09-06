import { BrowserWindow, app } from "electron";
import path from "node:path";
import { getDb } from "./db/client";

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1080,
    height: 720,
  });

  win.loadFile(path.join(__dirname, "renderer", "index.html"));
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
