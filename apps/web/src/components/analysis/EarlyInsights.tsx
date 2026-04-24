import React from "react";
import { Box, Card, Typography } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import SearchIcon from "@mui/icons-material/Search";

const INSIGHTS = [
  {
    icon: <WarningAmberIcon sx={{ fontSize: 16, color: "#F59E0B" }} />,
    title: "LCP Alert",
    detail: "Hero image exceeds 1.3MB. Optimization recommended.",
    color: "#F59E0B",
  },
  {
    icon: <SearchIcon sx={{ fontSize: 16, color: "#5B7BFF" }} />,
    title: "SEO Tip",
    detail: "Missing meta descriptions on 4 category pages.",
    color: "#5B7BFF",
  },
];

export default function EarlyInsights() {
  return (
    <Card sx={{ height: "100%" }}>
      <Box p={2}>
        <Typography variant="subtitle2" fontWeight={700} mb={1.5}>
          Early Insights
        </Typography>
        <Box display="flex" flexDirection="column" gap={1.5}>
          {INSIGHTS.map((ins) => (
            <Box
              key={ins.title}
              sx={{
                p: 1.5,
                borderRadius: 2,
                border: "1px solid",
                borderColor: `${ins.color}30`,
                bgcolor: `${ins.color}0A`,
              }}
            >
              <Box display="flex" alignItems="center" gap={0.75} mb={0.5}>
                {ins.icon}
                <Typography variant="caption" fontWeight={700} sx={{ color: ins.color }}>
                  {ins.title}
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary" lineHeight={1.5}>
                {ins.detail}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Card>
  );
}
