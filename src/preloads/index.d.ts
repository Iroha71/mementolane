import {
  CardRequestSchema,
  CardSchema,
  InsertTaskResult,
} from "../shared/cardSchema";

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
    };
  }
}

export {};
