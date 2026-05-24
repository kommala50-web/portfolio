"use client";

import {
  createContext, useContext, useState, useCallback,
  type ReactNode,
} from "react";
import { THEMES, type Theme, type ThemeColors } from "@/lib/tokens";

interface ThemeCtx {
  theme:  Theme;
  C:      ThemeColors;
  toggle: () => void;
}

const Ctx = createContext<ThemeCtx>({
  theme:  "dark",
  C:      THEMES.dark,
  toggle: () => {},
});

export const useTheme = () => useContext(Ctx);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const toggle = useCallback(
    () => setTheme((t) => (t === "dark" ? "light" : "dark")),
    []
  );
  const C = THEMES[theme];

  return (
    <Ctx.Provider value={{ theme, C, toggle }}>
      <div
        data-theme={theme}
        style={{
          background:  C.bgBase,
          color:       C.textPrimary,
          minHeight:   "100vh",
          transition: "background 400ms cubic-bezier(0.4,0,0.2,1), color 400ms cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {children}
      </div>
    </Ctx.Provider>
  );
}
