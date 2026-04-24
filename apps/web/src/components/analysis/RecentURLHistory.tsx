import React from "react";
import { Box, Grid, Typography, useTheme } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { recentUrlHistory } from "../../data/mockData";

function getScoreColor(score: number) {
  if (score >= 80) return "#22C55E";
  if (score >= 60) return "#F59E0B";
  return "#EF4444";
}

export default function RecentURLHistory() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Grid container spacing={1.5}>
      {recentUrlHistory.map((item) => (
        <Grid item xs={12} sm={6} key={item.url}>
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              bgcolor: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              "&:hover": { borderColor: "primary.main" },
              transition: "border-color 0.2s",
            }}
          >
            <Box display="flex" alignItems="center" gap={1.25}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 1.5,
                  bgcolor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <LanguageIcon sx={{ fontSize: 16, color: "text.secondary" }} />
              </Box>
              <Box>
                <Typography variant="body2" fontWeight={500} noWrap sx={{ maxWidth: 160 }}>
                  {item.url}
                </Typography>
                <Box display="flex" alignItems="center" gap={0.5}>
                  <AccessTimeIcon sx={{ fontSize: 11, color: "text.secondary" }} />
                  <Typography variant="caption" color="text.secondary">{item.when}</Typography>
                </Box>
              </Box>
            </Box>
            <Box textAlign="right">
              <Typography variant="subtitle2" fontWeight={700} color={getScoreColor(item.score)}>
                {item.score}/100
              </Typography>
              <Typography variant="caption" color="text.secondary" letterSpacing={0.5}>
                SCORE
              </Typography>
            </Box>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
}
