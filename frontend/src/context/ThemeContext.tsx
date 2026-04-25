import React, { createContext, useContext, useMemo, useState } from "react";
import { ThemeProvider, CssBaseline, PaletteMode } from "@mui/material";
import { getTheme } from "../theme/theme";

interface ThemeCtx {
  mode: PaletteMode;
  toggleMode: () => void;
}

const THEME_KEY = "theme_mode";

const ThemeCtx = createContext<ThemeCtx>({ mode: "dark", toggleMode: () => {} });

function getInitialMode(): PaletteMode {
  const stored = localStorage.getItem(THEME_KEY);
  return stored === "light" ? "light" : "dark";
}

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<PaletteMode>(getInitialMode);
  const theme = useMemo(() => getTheme(mode), [mode]);

  const toggleMode = () =>
    setMode((m) => {
      const next = m === "dark" ? "light" : "dark";
      localStorage.setItem(THEME_KEY, next);
      return next;
    });

  return (
    <ThemeCtx.Provider value={{ mode, toggleMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeCtx.Provider>
  );
}

export const useThemeMode = () => useContext(ThemeCtx);
