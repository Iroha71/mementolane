import { contextBridge, ipcRenderer } from "electron";
import { CardRequestSchema } from "../shared/cardSchema";
import {
  EffortBlockRequest,
  SaveWeekEffortsRequest,
} from "../shared/effortBlockSchema";

contextBridge.exposeInMainWorld("api", {
  sendMessage: (msg: string) => ipcRenderer.invoke("sendMessage", msg),
  getActiveTasks: () => ipcRenderer.invoke("getActiveTasks"),
  getTask: (id: number) => ipcRenderer.invoke("getTask", id),
  addTask: (request: CardRequestSchema) =>
    ipcRenderer.invoke("insertTask", request),
  updateTask: (id: number, request: CardRequestSchema) =>
    ipcRenderer.invoke("updateTask", id, request),
  registEffort: (request: EffortBlockRequest) =>
    ipcRenderer.invoke("registEffort", request),
  getAllTasks: () => ipcRenderer.invoke("getAllTasks"),
  getWeekEfforts: (weekStart: Date) =>
    ipcRenderer.invoke("getWeekEfforts", weekStart),
  saveWeekEfforts: (request: SaveWeekEffortsRequest) =>
    ipcRenderer.invoke("saveWeekEfforts", request),
});
