import React, { createContext, useContext, useMemo, useState } from "react";
import { ThemeProvider, CssBaseline, PaletteMode } from "@mui/material";
import { getTheme } from "../theme/theme";

interface ThemeCtx {
  mode: PaletteMode;
  toggleMode: () => void;
}

const ThemeCtx = createContext<ThemeCtx>({ mode: "dark", toggleMode: () => {} });

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<PaletteMode>("dark");
  const theme = useMemo(() => getTheme(mode), [mode]);
  const toggleMode = () => setMode((m) => (m === "dark" ? "light" : "dark"));

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
