import { create } from "zustand";

interface PortfolioStore {
  // Theme
  theme: "dark" | "light";
  toggleTheme: () => void;

  // Modal
  activeModal: string | null;
  setModal: (id: string | null) => void;

  // Cursor
  cursorVariant: "default" | "link" | "text" | "drag";
  setCursor: (v: PortfolioStore["cursorVariant"]) => void;

  // Loading
  isLoading: boolean;
  setLoading: (v: boolean) => void;
}

export const useStore = create<PortfolioStore>((set) => ({
  theme: "dark",
  toggleTheme: () =>
    set((s) => ({ theme: s.theme === "dark" ? "light" : "dark" })),

  activeModal: null,
  setModal: (id) => set({ activeModal: id }),

  cursorVariant: "default",
  setCursor: (v) => set({ cursorVariant: v }),

  isLoading: true,
  setLoading: (v) => set({ isLoading: v }),
}));
