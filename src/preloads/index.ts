import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("api", {
  sendMessage: (msg: string) => ipcRenderer.invoke("sendMessage", msg),
  getActiveTasks: () => ipcRenderer.invoke("getActiveTasks"),
});
