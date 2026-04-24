import { createTheme, PaletteMode } from "@mui/material";

const DARK_BG = "#0B0F1E";
const DARK_SURFACE = "#131929";
const DARK_CARD = "#1A2235";
const DARK_BORDER = "rgba(255,255,255,0.08)";

const LIGHT_BG = "#F0F4FF";
const LIGHT_SURFACE = "#FFFFFF";
const LIGHT_CARD = "#FFFFFF";
const LIGHT_BORDER = "rgba(91,123,255,0.12)";
const LIGHT_SIDEBAR = "#FFFFFF";

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
      divider: mode === "dark" ? DARK_BORDER : "rgba(91,123,255,0.1)",
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
            boxShadow:
              mode === "dark"
                ? "none"
                : "0 1px 3px rgba(91,123,255,0.08), 0 4px 16px rgba(91,123,255,0.06)",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: { textTransform: "none", fontWeight: 600, borderRadius: 8 },
          containedPrimary: {
            background: `linear-gradient(135deg, ${PRIMARY} 0%, ${PRIMARY_DARK} 100%)`,
            boxShadow: "0 2px 8px rgba(91,123,255,0.35)",
            "&:hover": {
              background: `linear-gradient(135deg, ${PRIMARY_DARK} 0%, #3650CC 100%)`,
              boxShadow: "0 4px 16px rgba(91,123,255,0.45)",
            },
          },
          outlinedPrimary: {
            borderColor: mode === "light" ? "rgba(91,123,255,0.4)" : undefined,
            "&:hover": {
              borderColor: mode === "light" ? PRIMARY : undefined,
              background: mode === "light" ? "rgba(91,123,255,0.06)" : undefined,
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
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottomColor:
              mode === "dark" ? DARK_BORDER : "rgba(91,123,255,0.08)",
          },
        },
      },
    },
  });

export const SIDEBAR_COLORS = {
  dark: { bg: "#0F1827", activeBg: "rgba(91,123,255,0.25)", activeText: "#fff", inactiveText: "rgba(255,255,255,0.5)", hoverBg: "rgba(255,255,255,0.07)", logoBg: "#fff", logoText: "#0F172A" },
  light: { bg: "#FFFFFF", activeBg: "rgba(91,123,255,0.1)", activeText: "#4361EE", inactiveText: "#64748B", hoverBg: "rgba(91,123,255,0.06)", logoBg: "#0F172A", logoText: "#fff" },
};

export const TOPBAR_COLORS = {
  dark: { bg: "#0F1827", text: "rgba(255,255,255,0.7)", searchBg: "rgba(255,255,255,0.05)", searchBorder: "rgba(255,255,255,0.08)", searchHoverBorder: "rgba(255,255,255,0.15)", placeholder: "rgba(255,255,255,0.4)" },
  light: { bg: "#FFFFFF", text: "#475569", searchBg: "#F0F4FF", searchBorder: "rgba(91,123,255,0.15)", searchHoverBorder: "rgba(91,123,255,0.35)", placeholder: "#94A3B8" },
};
