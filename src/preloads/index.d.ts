import {
  CardRequestSchema,
  CardSchema,
  InsertTaskResult,
} from "../shared/cardSchema";
import { EffortBlock, EffortBlockRequest } from "../shared/effortBlockSchema";

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
    };
  }
}

export {};
