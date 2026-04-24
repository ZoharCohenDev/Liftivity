import { createTheme, PaletteMode } from "@mui/material";

const DARK_BG = "#0B0F1E";
const DARK_SURFACE = "#131929";
const DARK_CARD = "#1A2235";
const DARK_BORDER = "rgba(255,255,255,0.08)";

const LIGHT_BG = "#F4F6FA";
const LIGHT_SURFACE = "#FFFFFF";
const LIGHT_CARD = "#FFFFFF";
const LIGHT_BORDER = "rgba(0,0,0,0.08)";

const PRIMARY = "#5B7BFF";
const PRIMARY_DARK = "#4361EE";

export const getTheme = (mode: PaletteMode) =>
  createTheme({
    palette: {
      mode,
      primary: { main: PRIMARY, dark: PRIMARY_DARK },
      secondary: { main: "#A78BFA" },
      success: { main: "#22C55E" },
      warning: { main: "#F59E0B" },
      error: { main: "#EF4444" },
      background: {
        default: mode === "dark" ? DARK_BG : LIGHT_BG,
        paper: mode === "dark" ? DARK_SURFACE : LIGHT_SURFACE,
      },
      divider: mode === "dark" ? DARK_BORDER : LIGHT_BORDER,
      text: {
        primary: mode === "dark" ? "#F1F5F9" : "#0F172A",
        secondary: mode === "dark" ? "#94A3B8" : "#64748B",
      },
    },
    typography: {
      fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
      h1: { fontWeight: 800 },
      h2: { fontWeight: 700 },
      h3: { fontWeight: 700 },
      h4: { fontWeight: 700 },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
    },
    shape: { borderRadius: 12 },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarColor:
              mode === "dark" ? "#2D3A52 transparent" : "#CBD5E1 transparent",
            "&::-webkit-scrollbar": { width: 6 },
            "&::-webkit-scrollbar-track": { background: "transparent" },
            "&::-webkit-scrollbar-thumb": {
              background: mode === "dark" ? "#2D3A52" : "#CBD5E1",
              borderRadius: 3,
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            backgroundColor: mode === "dark" ? DARK_CARD : LIGHT_CARD,
            border: `1px solid ${mode === "dark" ? DARK_BORDER : LIGHT_BORDER}`,
            borderRadius: 12,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: { textTransform: "none", fontWeight: 600, borderRadius: 8 },
          containedPrimary: {
            background: `linear-gradient(135deg, ${PRIMARY} 0%, ${PRIMARY_DARK} 100%)`,
            "&:hover": {
              background: `linear-gradient(135deg, ${PRIMARY_DARK} 0%, #3650CC 100%)`,
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: { root: { borderRadius: 6, fontWeight: 600 } },
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: { borderRadius: 4, height: 6 },
          bar: { borderRadius: 4 },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            backgroundColor: mode === "dark" ? DARK_SURFACE : LIGHT_SURFACE,
          },
        },
      },
    },
  });
