import { create } from "zustand";

interface Config {
  apiUrl: string;
}

export const useConfig = create<Config>(() => ({
  apiUrl: "https://localhost:8080",
}));
