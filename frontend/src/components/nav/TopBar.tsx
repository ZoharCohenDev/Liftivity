import React from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Toolbar,
  Tooltip,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import AddIcon from "@mui/icons-material/Add";
import ThemeToggle from "../ThemeToggle";
import { useAuth } from "../../context/AuthContext";

function getInitials(displayName: string): string {
  const parts = displayName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function TopBar() {
  const theme = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const bg = theme.palette.mode === "dark" ? "#0F1827" : "#1A2235";

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: bg,
        borderBottom: `1px solid ${theme.palette.divider}`,
        zIndex: theme.zIndex.appBar,
      }}
    >
      <Toolbar sx={{ gap: 2, minHeight: "52px !important", px: 2 }}>
        {/* Search */}
        <TextField
          size="small"
          placeholder="Search analyses..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 16, color: "text.secondary" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            flex: 1,
            maxWidth: 320,
            "& .MuiOutlinedInput-root": {
              bgcolor: "rgba(255,255,255,0.05)",
              borderRadius: 2,
              fontSize: 13,
              color: "rgba(255,255,255,0.7)",
              "& fieldset": { borderColor: "rgba(255,255,255,0.08)" },
              "&:hover fieldset": { borderColor: "rgba(255,255,255,0.15)" },
            },
            "& input::placeholder": { color: "rgba(255,255,255,0.4)" },
          }}
        />

        <Box flex={1} />

        {/* New Analysis */}
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={() => navigate("/app/new-analysis")}
          sx={{ whiteSpace: "nowrap", fontSize: 13 }}
        >
          New Analysis
        </Button>

        <ThemeToggle iconColor="rgba(255,255,255,0.7)" />

        {/* Notifications */}
        <Tooltip title="Notifications">
          <IconButton size="small" sx={{ color: "rgba(255,255,255,0.7)" }}>
            <Badge badgeContent={3} color="error">
              <NotificationsOutlinedIcon sx={{ fontSize: 20 }} />
            </Badge>
          </IconButton>
        </Tooltip>

        {/* Avatar */}
        <Avatar
          sx={{
            width: 30,
            height: 30,
            fontSize: 12,
            fontWeight: 700,
            bgcolor: "primary.main",
            cursor: "pointer",
          }}
        >
          {user ? getInitials(user.displayName) : "?"}
        </Avatar>
      </Toolbar>
    </AppBar>
  );
}
