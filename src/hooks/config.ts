import { create } from "zustand";

interface Config {
  apiUrl: string;
}

export const useConfig = create<Config>(() => ({
  apiUrl: "http://localhost:8080",
}));
