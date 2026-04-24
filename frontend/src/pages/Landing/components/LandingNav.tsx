import React from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import ThemeToggle from "../../../components/ThemeToggle";

export default function LandingNav() {
  const theme = useTheme();
  const navigate = useNavigate();
  const isDark = theme.palette.mode === "dark";

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: isDark ? "rgba(11,15,30,0.9)" : "rgba(255,255,255,0.9)",
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ px: "0 !important", gap: 4, minHeight: "64px !important" }}>
          {/* Logo */}
          <Box display="flex" alignItems="center" gap={1} sx={{ cursor: "pointer" }} onClick={() => navigate("/")}>
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
            <Typography fontWeight={700} fontSize={16} color="text.primary">
              Liftivity
            </Typography>
          </Box>

          <Box flex={1} />

          <Box display="flex" alignItems="center" gap={1}>
            <ThemeToggle />
            <Button variant="text" size="small" sx={{ color: "text.secondary" }}>
              Sign In
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={() => navigate("/app/overview")}
              sx={{ px: 2.5 }}
            >
              Start Free Trial
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
