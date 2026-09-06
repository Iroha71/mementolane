declare global {
  interface Window {
    api: {
      sendMessage: (msg: string) => Promise<void>;
    };
  }
}

export {};
