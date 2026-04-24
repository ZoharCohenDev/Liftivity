import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import { useThemeMode } from "../context/ThemeContext";

interface Props {
  iconColor?: string;
}

export default function ThemeToggle({ iconColor }: Props) {
  const { mode, toggleMode } = useThemeMode();
  return (
    <Tooltip title={`Switch to ${mode === "dark" ? "light" : "dark"} mode`}>
      <IconButton size="small" onClick={toggleMode} sx={{ color: iconColor }}>
        {mode === "dark" ? (
          <LightModeOutlinedIcon sx={{ fontSize: 20 }} />
        ) : (
          <DarkModeOutlinedIcon sx={{ fontSize: 20 }} />
        )}
      </IconButton>
    </Tooltip>
  );
}
