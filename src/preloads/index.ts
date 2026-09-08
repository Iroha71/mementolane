import { contextBridge, ipcRenderer } from "electron";
import { CardRequestSchema } from "../shared/cardSchema";

contextBridge.exposeInMainWorld("api", {
  sendMessage: (msg: string) => ipcRenderer.invoke("sendMessage", msg),
  getActiveTasks: () => ipcRenderer.invoke("getActiveTasks"),
  addTask: (request: CardRequestSchema) => ipcRenderer.invoke("insertTask", request),
});
