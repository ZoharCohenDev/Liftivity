import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Typography, useTheme } from "@mui/material";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import UsageBar from "../UsageBar";

const NAV_ITEMS = [
  { label: "Overview", icon: <DashboardOutlinedIcon />, path: "/app/overview" },
  { label: "Sites", icon: <LanguageOutlinedIcon />, path: "/app/sites" },
  { label: "Analyses", icon: <BarChartOutlinedIcon />, path: "/app/new-analysis" },
  { label: "Recommendations", icon: <LightbulbOutlinedIcon />, path: "/app/report" },
  { label: "Settings", icon: <SettingsOutlinedIcon />, path: "/app/settings" },
];

const SIDEBAR_W = 200;

export default function Sidebar() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const bg = theme.palette.mode === "dark" ? "#0F1827" : "#1A2235";

  return (
    <Box
      sx={{
        width: SIDEBAR_W,
        flexShrink: 0,
        bgcolor: bg,
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        position: "sticky",
        top: 0,
        overflowY: "auto",
      }}
    >
      {/* Logo */}
      <Box sx={{ px: 2.5, py: 2.5, display: "flex", alignItems: "center", gap: 1 }}>
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: 1.5,
            background: "linear-gradient(135deg, #5B7BFF 0%, #A78BFA 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: 14 }}>L</Typography>
        </Box>
        <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>Liftivity</Typography>
      </Box>

      {/* Nav */}
      <List disablePadding sx={{ px: 1.5, flex: 1 }}>
        {NAV_ITEMS.map(({ label, icon, path }) => {
          const active = location.pathname === path || (path === "/app/new-analysis" && location.pathname.startsWith("/app/analysis"));
          return (
            <ListItemButton
              key={label}
              onClick={() => navigate(path)}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                py: 1,
                px: 1.5,
                color: active ? "#fff" : "rgba(255,255,255,0.5)",
                bgcolor: active ? "rgba(91,123,255,0.25)" : "transparent",
                "&:hover": {
                  bgcolor: active ? "rgba(91,123,255,0.3)" : "rgba(255,255,255,0.07)",
                  color: "#fff",
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 32, color: "inherit", "& svg": { fontSize: 18 } }}>
                {icon}
              </ListItemIcon>
              <ListItemText
                primary={label}
                primaryTypographyProps={{ fontSize: 13, fontWeight: active ? 600 : 400 }}
              />
            </ListItemButton>
          );
        })}
      </List>

      {/* Usage */}
      <Box sx={{ px: 2.5, pb: 2.5 }}>
        <UsageBar used={12} total={20} label="USAGE" />
      </Box>
    </Box>
  );
}
