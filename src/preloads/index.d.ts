import {
  CardRequestSchema,
  CardSchema,
  InsertTaskResult,
} from "../shared/cardSchema";
import {
  EffortBlock,
  EffortBlockRequest,
  EffortBlocksResult,
  SaveWeekEffortsRequest,
} from "../shared/effortBlockSchema";

declare global {
  interface Window {
    api: {
      sendMessage: (msg: string) => Promise<void>;
      getActiveTasks: () => Promise<CardSchema[]>;
      getTask: (id: number) => Promise<CardSchema | null>;
      addTask: (request: CardRequestSchema) => Promise<InsertTaskResult>;
      updateTask: (
        id: number,
        request: CardRequestSchema,
      ) => Promise<InsertTaskResult>;
      registEffort: (request: EffortBlockRequest) => Promise<EffortBlock>;
      getAllTasks: () => Promise<| {success: true, tasks: CardSchema[]} | {success: false, message: string}>;
      getWeekEfforts: (weekStart: Date) => Promise<EffortBlocksResult>;
      saveWeekEfforts: (
        request: SaveWeekEffortsRequest,
      ) => Promise<EffortBlocksResult>;
    };
  }
}

export {};
