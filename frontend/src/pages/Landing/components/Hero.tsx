import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Container, Typography, useTheme } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SpeedIcon from "@mui/icons-material/Speed";

const TRUSTED = ["Velocity", "Cloudflare", "Datafine", "Synthetia", "Nimira"];

export default function Hero() {
  const theme = useTheme();
  const navigate = useNavigate();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        background: isDark
          ? "linear-gradient(180deg, #0B0F1E 0%, #0E1428 100%)"
          : "linear-gradient(180deg, #F4F6FA 0%, #EEF2FF 100%)",
        pt: 12,
        pb: 8,
      }}
    >
      <Container maxWidth="lg">
        {/* Headline */}
        <Box textAlign="center" mb={6}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: 36, md: 56 },
              fontWeight: 800,
              lineHeight: 1.1,
              mb: 2.5,
              background: isDark
                ? "linear-gradient(135deg, #FFFFFF 30%, #A78BFA 100%)"
                : "linear-gradient(135deg, #0F172A 30%, #5B7BFF 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Convert More,<br />Guess Less.
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: 520, mx: "auto", mb: 4, lineHeight: 1.7 }}
          >
            Liftivity analyzes your website in real-time to pinpoint exactly why
            visitors aren't converting. Get actionable insights, not just more data.
          </Typography>
          <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
            <Button
              variant="contained"
              size="large"
              startIcon={<SpeedIcon />}
              onClick={() => navigate("/app/new-analysis")}
              sx={{ px: 3.5 }}
            >
              Analyze Your Site — Free
            </Button>
            <Button
              variant="outlined"
              size="large"
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate("/app/overview")}
              sx={{ px: 3.5 }}
            >
              View Demo Dashboard
            </Button>
          </Box>
        </Box>

        {/* Hero visual */}
        <Box
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            border: `1px solid ${theme.palette.divider}`,
            bgcolor: isDark ? "#131929" : "#fff",
            mb: 6,
            height: 280,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {/* Abstract gradient orbs */}
          <Box
            sx={{
              position: "absolute",
              width: 280,
              height: 280,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(91,123,255,0.35) 0%, transparent 70%)",
              left: "20%",
              top: "50%",
              transform: "translateY(-50%)",
              filter: "blur(40px)",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              width: 220,
              height: 220,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(167,139,250,0.3) 0%, transparent 70%)",
              right: "20%",
              top: "40%",
              transform: "translateY(-50%)",
              filter: "blur(50px)",
            }}
          />
          <Box
            sx={{
              position: "relative",
              zIndex: 1,
              bgcolor: isDark ? "#1A2235" : "#F8FAFC",
              borderRadius: 2,
              px: 3,
              py: 2,
              border: `1px solid ${theme.palette.divider}`,
              minWidth: 220,
            }}
          >
            <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
              Analysis Complete
            </Typography>
            <Typography variant="h4" fontWeight={800} color="success.main">84</Typography>
            <Typography variant="caption" color="text.secondary">
              Conversion Health Score
            </Typography>
          </Box>
        </Box>

        {/* Trusted by */}
        <Box textAlign="center">
          <Typography variant="caption" color="text.secondary" display="block" mb={2} letterSpacing={1}>
            TRUSTED BY HIGH-GROWTH TEAMS
          </Typography>
          <Box display="flex" gap={4} justifyContent="center" flexWrap="wrap">
            {TRUSTED.map((name) => (
              <Typography key={name} variant="body2" fontWeight={600} color="text.secondary" sx={{ opacity: 0.6 }}>
                {name}
              </Typography>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
