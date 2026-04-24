import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Container, Typography, useTheme } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function CallToAction() {
  const theme = useTheme();
  const navigate = useNavigate();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        py: 10,
        background: isDark
          ? "linear-gradient(135deg, #1A2560 0%, #0B0F1E 100%)"
          : "linear-gradient(135deg, #5B7BFF 0%, #A78BFA 100%)",
      }}
    >
      <Container maxWidth="md">
        <Box textAlign="center">
          <Typography
            variant="h3"
            fontWeight={800}
            mb={2}
            color={isDark ? "text.primary" : "#fff"}
          >
            Ready to skyrocket your conversion?
          </Typography>
          <Typography
            variant="body1"
            mb={4}
            sx={{ color: isDark ? "text.secondary" : "rgba(255,255,255,0.8)" }}
          >
            Join 2,000+ companies who stopped guessing and started growing with Liftivity.
            Your first analysis is on us.
          </Typography>
          <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/app/new-analysis")}
              sx={{
                px: 4,
                bgcolor: isDark ? "primary.main" : "#fff",
                color: isDark ? "#fff" : "primary.main",
                "&:hover": {
                  bgcolor: isDark ? "primary.dark" : "rgba(255,255,255,0.9)",
                },
              }}
            >
              Start Free Analysis
            </Button>
            <Button
              variant="outlined"
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{
                px: 4,
                borderColor: isDark ? "primary.main" : "rgba(255,255,255,0.6)",
                color: isDark ? "primary.main" : "#fff",
                "&:hover": {
                  borderColor: isDark ? "primary.light" : "#fff",
                  bgcolor: "transparent",
                },
              }}
            >
              Talk to an expert
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
