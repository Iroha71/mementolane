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
      addTask: (request: CardRequestSchema) => Promise<InsertTaskResult>;
    };
  }
}

export {};
