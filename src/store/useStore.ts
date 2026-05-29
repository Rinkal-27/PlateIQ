import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DietId } from "@/data/dietaryRules";

export interface HistoryItem {
  id: string;
  ts: number;
  kind: "barcode" | "label" | "plate";
  title: string;
  subtitle?: string;
  scorePct?: number;
  imageUri?: string;
}

interface StoreState {
  diets: DietId[];
  history: HistoryItem[];
  toggleDiet: (d: DietId) => void;
  pushHistory: (item: HistoryItem) => void;
  clearHistory: () => void;
  hydrate: () => Promise<void>;
}

const STORAGE_KEY = "plateiq.v1";

export const useStore = create<StoreState>((set, get) => ({
  diets: ["vegetarian"],
  history: [],

  toggleDiet: (d) => {
    const next = get().diets.includes(d)
      ? get().diets.filter((x) => x !== d)
      : [...get().diets, d];
    set({ diets: next });
    void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ ...get(), diets: next }));
  },

  pushHistory: (item) => {
    const next = [item, ...get().history].slice(0, 50);
    set({ history: next });
    void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ ...get(), history: next }));
  },

  clearHistory: () => {
    set({ history: [] });
    void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ ...get(), history: [] }));
  },

  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      set({
        diets: parsed.diets ?? ["vegetarian"],
        history: parsed.history ?? [],
      });
    } catch {
      // ignore corrupted storage — non-fatal
    }
  },
}));
