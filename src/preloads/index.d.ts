import { CardSchema } from "../shared/cardSchema";

declare global {
  interface Window {
    api: {
      sendMessage: (msg: string) => Promise<void>;
      getActiveTasks: () => Promise<CardSchema[]>;
    };
  }
}

export {};
