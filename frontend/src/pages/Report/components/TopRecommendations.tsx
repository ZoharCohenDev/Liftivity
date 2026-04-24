import React from "react";
import { Box, Button, Card, Typography, useTheme } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { topRecommendations } from "../../../data/mockData";
import SectionHeader from "../../../components/SectionHeader";

export default function TopRecommendations() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Card sx={{ height: "100%" }}>
      <Box p={2.5}>
        <SectionHeader
          title="Top Recommendations"
          subtitle="Estimated issue if resolved"
        />
        <Box display="flex" flexDirection="column" gap={1.5}>
          {topRecommendations.map((rec) => (
            <Box
              key={rec.title}
              sx={{
                p: 1.5,
                borderRadius: 2,
                border: "1px solid",
                borderColor: theme.palette.divider,
                bgcolor: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.01)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1,
              }}
            >
              <Box>
                <Typography variant="caption" fontWeight={600} display="block" mb={0.25}>
                  {rec.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {rec.effort}
                </Typography>
              </Box>
              {rec.impact && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.25,
                    color: "success.main",
                    fontSize: 12,
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                  }}
                >
                  <ArrowUpwardIcon sx={{ fontSize: 12 }} />
                  {rec.impact}
                </Box>
              )}
            </Box>
          ))}
        </Box>
        <Button
          fullWidth
          variant="outlined"
          size="small"
          sx={{ mt: 2, fontSize: 12 }}
        >
          View All Recommendations →
        </Button>
      </Box>
    </Card>
  );
}
