import { contextBridge, ipcRenderer } from "electron";
import { CardRequestSchema } from "../shared/cardSchema";

contextBridge.exposeInMainWorld("api", {
  sendMessage: (msg: string) => ipcRenderer.invoke("sendMessage", msg),
  getActiveTasks: () => ipcRenderer.invoke("getActiveTasks"),
  getTask: (id: number) => ipcRenderer.invoke("getTask", id),
  addTask: (request: CardRequestSchema) =>
    ipcRenderer.invoke("insertTask", request),
  updateTask: (id: number, request: CardRequestSchema) =>
    ipcRenderer.invoke("updateTask", id, request),
});
